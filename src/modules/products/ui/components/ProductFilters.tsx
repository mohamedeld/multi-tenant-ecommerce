"use client";
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { ReactNode, useState } from "react";

interface IProps{
    title:string;
    className?:string;
    children:ReactNode
}

const ProductFilter = ({title,className,children}:IProps)=>{
    const [isOpen,setIsOpen] = useState(false);
    const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

    return (
        <div className={cn(
            "p-4 border-b flex flex-col gap-2",className
        )}>
            <div onClick={()=> setIsOpen(currentVal=> !currentVal)} className="flex items-center justify-between cursor-pointer">
                <p className="font-medium">{title}</p>
                <Icon className="size-5"/>
            </div>
            {isOpen && children}
        </div>
    )
}

const ProductFilters = () => {
  return (
    <div className="border rounded-md bg-white">
        <div className="p-4 border-b flex items-center justify-between">
            <p className="font-medium">Filters</p>
            <Button className="underline" type="button" onClick={()=>{}}>Clear</Button>
        </div>
        <ProductFilter title="Price">
            <p>Price Filter!</p>
        </ProductFilter>
    </div>
  )
}

export default ProductFilters