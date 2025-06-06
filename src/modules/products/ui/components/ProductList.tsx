"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface IProps{
    category?:string;
}

const ProductList = ({category}:IProps) => {
    const trcp = useTRPC();
    const {data} = useSuspenseQuery(trcp.products.getMany.queryOptions({
        category
    }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {data?.docs?.map((product)=>{
            return (
                <div key={product?.id} className="border rounded-md bg-white">
                    <h2 className="text-xl font-medium">{product?.name}</h2>
                    <p>${product?.price}</p>
                </div>
            )
        })}
    </div>
  )
}

export default ProductList


export const ProductListSkeleton = ()=>{
    return (
        <div>Loading...</div>
    )
}