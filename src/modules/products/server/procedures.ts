import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Sort, Where } from "payload";
import { z } from "zod";
import { sortValues } from "../hooks/useProductFilters";

export const productRouters = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice:z.string().nullable().optional(),
        maxPrice:z.string().nullable().optional(),
        tags:z.array(z.string()).nullable().optional(),
        sort:z.enum(sortValues).nullable().optional()
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
        depth: 1,
        where,
        sort
      });

      return data;
    }),
});
