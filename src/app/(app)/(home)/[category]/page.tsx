import ProductList, { ProductListSkeleton } from "@/modules/products/ui/components/ProductList";
import {  getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface IProps{
    params:Promise<{
        category:string;
    }>
}
const CategoryPage = async ({params}:IProps) => {
  const {category} = await params;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
        category
    }))

    return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton/>}>
            <ProductList category={category}/>
        </Suspense>
    </HydrationBoundary>
  )
}

export default CategoryPage