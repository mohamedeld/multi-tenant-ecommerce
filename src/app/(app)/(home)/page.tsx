
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs";
import { loadProductFilters } from "@/modules/products/hooks/useProductFilters";
import ProductListView from "@/modules/products/ui/views/ProductListView";
import { LIMIT } from "@/modules/tags/constants";


interface IProps {
  searchParams:Promise<SearchParams>
}
const HomePage = async ({searchParams }: IProps) => {
  const queryClient = getQueryClient();
  const filters = await loadProductFilters(searchParams);

  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      limit:LIMIT
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  );
};

export default HomePage;
