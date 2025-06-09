"use client";

import { Button } from "@/components/ui/button";
import { generateTenantURL } from "@/lib/utils";
import Link from "next/link";


interface IProps{
    slug:string;
}
const Navbar = ({slug}:IProps) => {
  return (
    <div className='border-b h-20 font-medium bg-white'>
        <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center  h-full px-4 lg:px-12">
           <p className="text-xl">Checkout</p>
            <Button variant={"elevated"} asChild>
                <Link href={`${generateTenantURL(slug)}`}>
                    Continue Shopping
                </Link>
            </Button>
        </div>
    </div>
  )
}

export default Navbar
