import { authRouter } from '@/modules/auth/server/procedures';
import {  createTRPCRouter } from '../init';
import { categoriesRouters } from '@/modules/categories/server/procedures';
import { productRouters } from '@/modules/products/server/procedures';
import { tagRouters } from '@/modules/tags/server/procedures';
export const appRouter = createTRPCRouter({
  categories:categoriesRouters,
  auth:authRouter,
  products:productRouters,
  tags:tagRouters
});
// export type definition of API
export type AppRouter = typeof appRouter;