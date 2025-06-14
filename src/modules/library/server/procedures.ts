import { LIMIT } from "@/modules/tags/constants";
import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const libraryRouter = createTRPCRouter({
    getOne:protectedProcedure.input(
        z.object({
           productId:z.string()
        })
    ).query(async ({ctx,input})=>{
        const data = await ctx.payload.find({
            collection:"orders",
            limit:1,
            pagination:false,
            where:{
                and:[
                    {
                        product:{
                            equals:input?.productId
                        }
                    },
                    {
                        user:{
                            equals:ctx?.session?.user?.id
                        }
                    }
                ]
            }
        });

        const order = data?.docs[0];
        if(!order){
            throw new TRPCError({
                code:"NOT_FOUND",
                message:"Order not found"
            })
        }

        const productData = await ctx.payload.findByID({
            collection:"products",
            id:input?.productId
        })
        if(!productData){
            throw new TRPCError({
                code:"NOT_FOUND",
                message:"Product not found"
            })
        }
        return productData;
    }),
    getMany:protectedProcedure.input(
        z.object({
            cursor:z.number().default(1),
            limit:z.number().default(LIMIT)
        })
    ).query(async ({ctx,input})=>{
        const data = await ctx.payload.find({
            collection:"orders",
            depth:0,
            page:input.cursor,
            limit:input?.limit,
            where:{
                user:{
                    equals:ctx?.session?.user?.id
                }
            }
        });

        const productIds = data?.docs?.map((order)=> order?.product);
        const productsData = await ctx.payload.find({
            collection:"products",
            pagination:false,
            where:{
                id:{
                    in:productIds
                }
            }
        })
        return {
                ...productsData,
                docs:productsData?.docs?.map((doc)=>({
                  ...doc,
                  image:doc?.image as Media | null,
                  tenant:doc?.tenant as Tenant & {image:Media | null},
                }))
              };
    })
})