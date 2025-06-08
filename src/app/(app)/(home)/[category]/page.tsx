
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs";
import { loadProductFilters } from "@/modules/products/hooks/useProductFilters";
import ProductListView from "@/modules/products/ui/views/ProductListView";
import { LIMIT } from "@/modules/tags/constants";


interface IProps {
  params: Promise<{
    category: string;
  }>;
  searchParams:Promise<SearchParams>
}
const CategoryPage = async ({ params,searchParams }: IProps) => {
  const { category } = await params;
  const queryClient = getQueryClient();
  const filters = await loadProductFilters(searchParams);

  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      category,
      ...filters,
      limit:LIMIT
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={category}/>
    </HydrationBoundary>
  );
};

export default CategoryPage;
