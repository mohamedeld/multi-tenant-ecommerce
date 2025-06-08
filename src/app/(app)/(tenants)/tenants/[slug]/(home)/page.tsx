import { loadProductFilters } from "@/modules/products/hooks/useProductFilters";
import ProductListView from "@/modules/products/ui/views/ProductListView";
import { LIMIT } from "@/modules/tags/constants";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs"

interface IProps{
    searchParams:Promise<SearchParams>;
    params:Promise<{
        slug:string
    }>
}

const TenantsPage = async ({searchParams,params}:IProps) => {
    const {slug} = await params;
    const filters = await loadProductFilters(searchParams);
    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        ...filters,
        tenantSlug:slug,
        limit:LIMIT
    }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductListView tenantSlug={slug} narrowView={true}/>
    </HydrationBoundary>
  )
}

export default TenantsPage