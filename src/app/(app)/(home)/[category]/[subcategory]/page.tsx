import { loadProductFilters } from "@/modules/products/hooks/useProductFilters";
import ProductListView from "@/modules/products/ui/views/ProductListView";
import { LIMIT } from "@/modules/tags/constants";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs";

interface IProps{
    params:Promise<{
        category:string;
        subcategory:string;
    }>;
    searchParams:Promise<SearchParams>
}
const SubCategoryPage = async ({params,searchParams}:IProps) => {
  const {category,subcategory} = await params;
  const queryClient = getQueryClient();
  const filters = await loadProductFilters(searchParams);

  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      category:subcategory,
      limit:LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={subcategory}/>
    </HydrationBoundary>
  );
}

export default SubCategoryPage