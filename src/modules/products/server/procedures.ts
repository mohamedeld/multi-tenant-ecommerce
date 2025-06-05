import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Where } from "payload";
import { z } from "zod";

export const productRouters = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
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
      });

      return data;
    }),
});
