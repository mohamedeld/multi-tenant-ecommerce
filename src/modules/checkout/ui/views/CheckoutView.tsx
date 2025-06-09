"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCart } from "../../hooks/use-cart";
import { useEffect } from "react";
import { toast } from "sonner";
import CheckoutItem from "../components/CheckoutItem";
import { generateTenantURL } from "@/lib/utils";
import CheckoutSidebar from "../components/CheckoutSidebar";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { useRouter } from "next/navigation";

interface IProps {
  tenantSlug: string;
}
const CheckoutView = ({ tenantSlug }: IProps) => {
    const [states,setStates] = useCheckoutStates();
    const router = useRouter();
  const { productIds, removeProduct,clearCart } = useCart(tenantSlug);
  const trpc = useTRPC();
  const { data, error ,isLoading} = useQuery(
    trpc.checkouts.getProducts.queryOptions({
      ids: productIds,
    })
  );

  useEffect(()=>{
    if(states?.success){
        setStates({success:false,
            cancel:false
        })
        clearCart();
        router.push("/products")
    }
  },[states?.success,router,setStates])

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Invalid products found, Cart cleared");
    }
  }, [error, clearCart]);

  
  const purchase = useMutation(trpc.checkouts.purchase.mutationOptions({
    onMutate:()=>{
        setStates({
            success:false,
            cancel:false
        })
    },
    onSuccess:(data)=>{
        window.location.href = data?.url
    },
    onError:(error)=>{
        if(error?.data?.code === "UNAUTHORIZED"){
            router.push("/sign-in")
        }
        toast.error(error?.message)
    }
  }))
if(isLoading){
    return (
         <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center flex-col p-8 gap-y-4 bg-white w-full rounded-lg">
            <LoaderIcon className="text-muted-foreground animate-spin"/>
        </div>
        </div>
    )
  }


  if (data?.docs?.length === 0) {
    return (
         <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="border border-black border-dashed flex items-center justify-center flex-col p-8 gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon />
        <p className="text-base font-medium">No products found</p>
      </div>
      </div>
    );
  }

  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {data?.docs?.map((product, index) => (
              <CheckoutItem
                key={product?.id}
                id={product?.id}
                isLast={index === data?.docs?.length - 1}
                imageUrl={product?.image?.url || ""}
                name={product?.name}
                productUrl={`${generateTenantURL(product?.tenant?.slug)}/products/${product?.id}`}
                tenantUrl={generateTenantURL(product?.tenant?.slug)}
                tenantName={product?.tenant?.name}
                price={product?.price}
                onRemove={() => removeProduct(product?.id)}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice || 0}
            onCheckout={() => purchase.mutate({
                productIds,
                tenantSlug
            })}
            isCanceled={states?.cancel}
            isPending={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
