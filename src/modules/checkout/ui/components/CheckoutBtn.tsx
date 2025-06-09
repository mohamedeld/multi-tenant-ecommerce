"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "../../hooks/use-cart";
import { cn, generateTenantURL } from "@/lib/utils";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

interface IProps{
    className?:string;
    tenantSlug:string;
    hideIfEmpty?:string
}
const CheckoutBtn = ({className,tenantSlug,hideIfEmpty}:IProps) => {
    const {totalItems } = useCart(tenantSlug);
    if(hideIfEmpty && totalItems ===0) return null;

  return (
    <Button variant={"elevated"} className={cn(
        "bg-white",className
    )} asChild>
        <Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
            <ShoppingCartIcon/>
            {totalItems > 0 ? totalItems : ""}
        </Link>
    </Button>
  )
}

export default CheckoutBtn