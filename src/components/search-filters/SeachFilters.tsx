
"use client";

import SearchInput from "./SearchInput"
import CategoriesList from "./CategoriesList"
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";


const SeachFilters = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
        <SearchInput />
        <CategoriesList data={data}/>
    </div>
  )
}

export default SeachFilters


export const SearchFiltersLoading = ()=>{
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full bg-[#f5f5f5]">
        <SearchInput disabled/>
        <div className="h-11 animate-pulse"/>
    </div>
  )
}