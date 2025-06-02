import {  createTRPCRouter } from '../init';
import { categoriesRouters } from '@/modules/categories/server/procedures';
export const appRouter = createTRPCRouter({
  categories:categoriesRouters
});
// export type definition of API
export type AppRouter = typeof appRouter;