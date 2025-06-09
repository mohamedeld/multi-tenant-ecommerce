import CheckoutView from "@/modules/checkout/ui/views/CheckoutView";

interface IProps{
    params:Promise<{
        slug:string;
    }>
}
const CheckoutPage = async ({params}:IProps) => {
const {slug} = await params
  return (
    <CheckoutView tenantSlug={slug}/>
  )
}

export default CheckoutPage