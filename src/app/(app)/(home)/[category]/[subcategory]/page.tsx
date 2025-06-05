import ProductList, { ProductListSkeleton } from "@/modules/products/ui/components/ProductList";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface IProps{
    params:Promise<{
        category:string;
        subcategory:string;
    }>
}
const SubCategoryPage = async ({params}:IProps) => {
  const {category,subcategory} = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
    category:subcategory
  }))
    return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton/>}>
            <ProductList category={subcategory}/>
        </Suspense>
    </HydrationBoundary>
  )
}

export default SubCategoryPage