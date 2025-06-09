import { useCallback } from "react";
import { useCartStore } from "../store/use-cart-store"

export const useCart = (tenantSlug:string)=>{
    //  const {getCartByTenant,addProduct,removeProduct,clearAllCarts,clearCart} = useCartStore();

     const getCartByTenant = useCartStore((state)=> state.getCartByTenant);
     const addProduct = useCartStore((state)=> state.addProduct);
     const removeProduct = useCartStore((state)=> state.removeProduct);
     const clearAllCarts = useCartStore((state)=> state.clearAllCarts);
     const clearCart = useCartStore((state)=> state.clearCart);

     const productIds = getCartByTenant(tenantSlug);

     const toggleProduct = useCallback((productId:string)=>{
        if(productIds?.includes(productId)){
            removeProduct(tenantSlug,productId)
        }else{
            addProduct(tenantSlug,productId)
        }
     },[addProduct,removeProduct,productIds,tenantSlug]);

     const isProductInCart = (productId:string)=>{
        return productIds?.includes(productId);
     }

     const clearTenantCart = ()=>{
        clearCart(tenantSlug)
     }
     return {
        productIds,
        addProduct:(productId:string)=> addProduct(tenantSlug,productId),
        removeProduct:(productId:string)=> removeProduct(tenantSlug,productId),
        clearCart:clearTenantCart,
        toggleProduct,
        clearAllCarts,
        isProductInCart,
        totalItems:productIds?.length
     }
}