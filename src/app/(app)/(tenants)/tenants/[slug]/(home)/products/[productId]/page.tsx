import ProductView from "@/modules/products/ui/views/ProductView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface IProps{
    params:Promise<{
        slug:string;
        productId:string;
    }>
}
const ProductDetailPage = async ({params}:IProps) => {
    const {slug,productId} = await params;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getOne.queryOptions({
        id:productId
    }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductView productId={productId} tenantSlug={slug} />
    </HydrationBoundary>
  )
}

export default ProductDetailPage