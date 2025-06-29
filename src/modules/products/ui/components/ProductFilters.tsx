"use client";
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import PriceFilter from "./PriceFilter";
import { useProductFilters } from "../../hooks/useProductFilters";
import TagsFilter from "@/modules/tags/ui/components/TagsFilter";

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
    const [filters,setFilters] = useProductFilters();
    const onChange = (key:keyof typeof filters,value:unknown)=>{
        setFilters({...filters,[key]:value});
    }
    const onClear = ()=>{
        setFilters({
            minPrice:"",
            maxPrice:"",
            tags:[]
        })
    }
  return (
    <div className="border rounded-md bg-white">
        <div className="p-4 border-b flex items-center justify-between">
            <p className="font-medium">Filters</p>
            <Button className="underline border-none shadow-none" variant={"ghost"} type="button" onClick={onClear}>Clear</Button>
        </div>
        <ProductFilter title="Price">
           <PriceFilter minPrice={filters?.minPrice} maxPrice={filters?.maxPrice} onMaxPriceChange={(value)=> onChange("maxPrice",value)} onMinPriceChange={(value)=> onChange('minPrice',value)}/>
        </ProductFilter>
        <ProductFilter title="Tags" className="border-b-0">
           <TagsFilter tags={filters?.tags}  onChange={(value)=> onChange('tags',value)}/>
        </ProductFilter>
    </div>
  )
}

export default ProductFilters