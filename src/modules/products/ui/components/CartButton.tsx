"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface IProps{
    tenantSlug:string;
    productId:string;
}

const CartButton = ({tenantSlug,productId}:IProps) => {
    const cart = useCart(tenantSlug);
    const handleClick = ()=>{
        cart.toggleProduct(productId)
    }
  return (
    <Button variant={"elevated"} onClick={handleClick} className={
        cn(
            "flex-1 bg-pink-400",
            cart.isProductInCart(productId) ? "bg-white":""
        )
    }>
                    {cart?.isProductInCart(productId) ? "Remove from cart" : "Add to cart"}
                  </Button>
  )
}

export default CartButton