
"use client";

import SearchInput from "./SearchInput"
import CategoriesList from "./CategoriesList"
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DEFAULT_BG_COLOR } from "@/modules/home/constants";
import BreadcrumbNavigation from "./BreadcrumbNavigation";


const SeachFilters = () => {
  const params = useParams();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
   const categoryParams = params?.category as string | undefined;

    const activeCategory = categoryParams || "all";
    const activeCategoryData = data?.find(category=> category?.slug === activeCategory);
    const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR;
    const activeCategoryName = activeCategoryData?.name || null;

    const activeSubCategory = params?.subcategory as string | undefined;
    const activeSubCategoryName = activeCategoryData?.subcategories?.find(sub=> sub?.slug === activeSubCategory)?.name || null;
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full" style={{
      backgroundColor:activeCategoryColor
    }}>
        <SearchInput />
        <div className="hidden lg:flex">
          <CategoriesList data={data}/>
        </div>
        <BreadcrumbNavigation
          activeCategoryName={activeCategoryName}
          activeCategory={activeCategory}
          activeSubCategoryName={activeSubCategoryName}
        />
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