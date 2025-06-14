import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Sort, Where } from "payload";
import { z } from "zod";
import { sortValues } from "../hooks/useProductFilters";
import { LIMIT } from "@/modules/tags/constants";

import {headers as getHeaders} from "next/headers";

export const productRouters = createTRPCRouter({
  getOne:baseProcedure.input(
    z.object({
      id:z.string()
    })
  ).query(async ({ctx,input})=>{
    const headers = await getHeaders();
    const session = await ctx.payload.auth({ headers });

    const product = await ctx.payload.findByID({
      collection:"products",
      id:input?.id
    });
    let isPurchase = false;
    if(session?.user){
      const orderData = await ctx.payload.find({
        collection:"orders",
        pagination:false,
        limit:1,
        where:{
          and:[
            {
              product:{
                equals:input?.id
              }
            },
            {
              user:{
                equals:session?.user?.id
              }
            }
          ]
        }
      });
      isPurchase = orderData?.totalDocs > 0;
    }

    const reviews = await ctx.payload.find({
      collection:"reviews",
      pagination:false,
      where:{
        product:{
          equals:input?.id
        }
      }
    })

    const reviewRating = reviews?.docs?.length > 0 ? reviews?.docs?.reduce((acc,review)=> acc + review?.rating,0) / reviews?.totalDocs : 0

    const ratingDistribution:Record<number, number> = {
      5:0,
      4:0,
      3:0,
      2:0,
      1:0
    }

    if(reviews?.totalDocs > 0){
      reviews?.docs?.forEach((review)=>{
        const rating = review?.rating;
        if(rating >= 1 && rating <=5){
          ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
        }
      })
      Object.keys(ratingDistribution)?.forEach((key)=>{
        const rating = Number(key);
        const count = ratingDistribution[rating] || 0;
        ratingDistribution[rating] = Math.round(
          (count / reviews?.totalDocs) * 100
        )
      })
    }



    return {
      ...product,
      isPurchase,
      image:product?.image as Media | null,
      cover:product?.cover as Media | null,
      tenant:product?.tenant as Tenant & {image: Media | null},
      reviewRating,
      reviewCount:reviews?.totalDocs,
      ratingDistribution
    };
  }),
  getMany: baseProcedure
    .input(
      z.object({
        cursor:z.number().default(1),
        limit:z.number().default(LIMIT),
        category: z.string().nullable().optional(),
        minPrice:z.string().nullable().optional(),
        maxPrice:z.string().nullable().optional(),
        tags:z.array(z.string()).nullable().optional(),
        sort:z.enum(sortValues).nullable().optional(),
        tenantSlug:z.string().nullable().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort:Sort = "-createdAt";
      if(input.sort === "trending"){
        sort = "-createdAt"
      }
      if(input.sort === "hot_and_new"){
        sort = "-createdAt"
      }
      if(input.sort === "created"){
        sort = "-createdAt"
      }
      if(input?.minPrice && input?.maxPrice){
        where.price = {
          less_than_equal:input.maxPrice,
          greater_than_equal:input.minPrice
        }
      }else if(input?.minPrice){
        where.price = {
          greater_than_equal:input.minPrice
        }
      }else if(input?.maxPrice){
        where.price = {
          less_than_equal:input.maxPrice
        }
      }
      if(input?.tenantSlug){
        where["tenant.slug"] = {
          equals:input?.tenantSlug
        }
      }
      if (input?.category) {
        const categoriesData = await ctx.payload.find({
          collection: "categories",
          limit: 1,
          depth:1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });
        if(input?.tags && input?.tags?.length > 0){
          where["tags.name"] = {
            in:input?.tags
          }
        }
        const formattedData = categoriesData?.docs?.map((doc) => ({
          ...doc,
          subcategories:
            doc?.subcategories?.docs?.map((item) => ({
              ...(item as Category),
              subcategories: undefined,
            })) || [],
        }));
        const subcategories = [];
        const category = formattedData[0];
        if (category) {
          subcategories.push(...category?.subcategories?.map(item=> item?.slug))
          where["category.slug"] = {
            in:[category?.slug,...subcategories],
          };
        }
      }
      const data = await ctx.payload.find({
        collection: "products",
        pagination: false,
        depth: 2,
        where,
        sort,
        page:input?.cursor,
        limit:input?.limit
      });
      const dataWithSummarizedReviews = await Promise.all(
        data?.docs?.map(async (doc)=>{
          const reviewsData = await ctx.payload.find({
            collection:"reviews",
            pagination:false,
            where:{
              product:{
                equals:doc?.id
              }
            }
          })
          return {
            ...doc,
            reviewCount:reviewsData?.totalDocs,
            reviewRating:reviewsData?.docs?.length === 0 ? 0 : reviewsData?.docs?.reduce((acc,review)=> acc + review?.rating,0) / reviewsData?.totalDocs
          }
        })
      )
      return {
        ...data,
        docs:dataWithSummarizedReviews?.map((doc)=>({
          ...doc,
          image:doc?.image as Media | null,
          tenant:doc?.tenant as Tenant & {image:Media | null},
        }))
      };
    }),
});
