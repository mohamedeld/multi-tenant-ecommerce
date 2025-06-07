import ProductFilters from "@/modules/products/ui/components/ProductFilters";
import ProductList, {
  ProductListSkeleton,
} from "@/modules/products/ui/components/ProductList";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import type { SearchParams } from "nuqs";
import { loadProductFilters } from "@/modules/products/hooks/useProductFilters";


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

  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category,
      ...filters
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
          <div className="lg:col-span-2 xl:col-span-2">
            <ProductFilters/>
          </div>
          <div className="lg:col-span-4 xl:col-span-6">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList category={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default CategoryPage;
