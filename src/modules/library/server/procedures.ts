import { LIMIT } from "@/modules/tags/constants";
import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

export const libraryRouter = createTRPCRouter({
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