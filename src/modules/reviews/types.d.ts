import { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";


export type ReviewsGetOneOutput = inferRouterOutputs<AppRouter>["reviews"]["getOne"]



