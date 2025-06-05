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
    <div>{JSON.stringify(data,null,2)}</div>
  )
}

export default ProductList


export const ProductListSkeleton = ()=>{
    return (
        <div>Loading...</div>
    )
}