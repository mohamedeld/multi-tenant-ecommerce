import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { getPayload } from "payload"
import configPromise from "@payload-config";
import { Category } from "@/payload-types";

export const categoriesRouters = createTRPCRouter({
    getMany:baseProcedure.query(async ({ctx})=>{
        
          const data = await ctx.payload.find({
            collection:'categories',
            pagination:false,
            depth:1,
            where:{
              parent:{
                exists:false
              }
            },
            sort:'name'
          });
          const formattedData = data?.docs?.map((doc)=>({
              ...doc,
              subcategories:doc?.subcategories?.docs?.map((item)=>({
                ...(item as Category),
                subcategories:undefined
              })) || []
            }))
        return formattedData
    })
})