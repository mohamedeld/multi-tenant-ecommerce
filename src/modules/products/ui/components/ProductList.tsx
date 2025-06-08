"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useProductFilters } from "../../hooks/useProductFilters";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { LIMIT } from "@/modules/tags/constants";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";

interface IProps{
    category?:string;
}

const ProductList = ({category}:IProps) => {
    const [filters] = useProductFilters();
    const trcp = useTRPC();
    const {data,isFetchingNextPage,hasNextPage,fetchNextPage} = useSuspenseInfiniteQuery(trcp.products.getMany.infiniteQueryOptions({
        category,
        ...filters,
        limit:LIMIT
    },{
        getNextPageParam:(lastPage)=>{
            return lastPage?.docs?.length > 0 ? lastPage?.nextPage : undefined
        }
    }));

    if(data?.pages?.[0]?.docs?.length  === 0){
        return (
            <div className="border border-black border-dashed flex items-center justify-center flex-col p-8 gap-y-4 bg-white w-full rounded-lg">
                <InboxIcon/>
                <p className="text-base font-medium">No products found</p>
            </div>
        )
    }

  return (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {data?.pages?.flatMap((page)=> page?.docs)?.map((product)=>{
            return (
                <ProductCard key={product?.id} id={product?.id} imageUrl={product?.image?.url} authorUsername="mohamed" authorImageUrl={undefined} reviewRating={3} reviewCount={5} price={product?.price} name={product?.name} />
            )
        })}
    </div>
     <div className="flex justify-center pt-8">
        {hasNextPage &&(
            <Button className="font-medium disabled:opacity-50 text-base bg-white " variant={"elevated"} onClick={()=> fetchNextPage()} disabled={isFetchingNextPage}>Load More</Button>
        )}
     </div>
    </>
  )
}

export default ProductList


export const ProductListSkeleton = ()=>{
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {Array.from({length:LIMIT})?.map((item,index)=>(
                <ProductCardSkeleton key={index}/>
            ))}
        </div>
    )
}