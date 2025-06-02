import { authRouter } from '@/modules/auth/server/procedures';
import {  createTRPCRouter } from '../init';
import { categoriesRouters } from '@/modules/categories/server/procedures';
export const appRouter = createTRPCRouter({
  categories:categoriesRouters,
  auth:authRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;