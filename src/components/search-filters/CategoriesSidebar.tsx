"use client";
import { CustomCategory } from "@/app/(app)/(home)/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface IProps{
    open:boolean;
    onOpenChange:React.Dispatch<React.SetStateAction<boolean>>;
}
const CategoriesSidebar = ({open,onOpenChange}:IProps) => {
    const trpc = useTRPC();
      const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
    const router = useRouter();
    const [parentCategories,setParentCategories] = useState<CustomCategory[] | null>(null);
    const [selectedCategory,setSelectedCategory] = useState<CustomCategory | null>(null);

    const currentCategories = parentCategories ?? data ?? [];

    const handleOpenChange = (open:boolean)=>{
        setParentCategories(null);
            setSelectedCategory(null);
            onOpenChange(open);
    }

    const handleCategoryClick = (category:CustomCategory)=>{
        if(category?.subcategories && category?.subcategories?.length > 0){
            setParentCategories(category?.subcategories as CustomCategory[]);
            setSelectedCategory(category);
        }else{
            if(parentCategories && selectedCategory){
                router.push(`/${selectedCategory?.slug}/${category?.slug}`)
            }else{
                if(category?.slug === "all"){
                    router.push("/");
                }else{
                    router.push(`/${category?.slug}`)
                }
            }
            handleOpenChange(false);
        }
    }

    const handleBackClick = ()=>{
        if(parentCategories && parentCategories?.length > 0){
            setParentCategories(null);
            setSelectedCategory(null);
        }
    }

    const backgroundColor = selectedCategory?.color || "white";
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="left" className="p-0 transition-none" style={{backgroundColor:backgroundColor}}>
            <SheetHeader className="p-4 border-b">
                <SheetTitle>Categories</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                {parentCategories && (
                    <button
                    onClick={handleBackClick}
                    className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                    >
                        <ChevronLeftIcon className="size-4 mr-2"/>
                        Back
                    </button>
                )}
                {currentCategories?.map((category)=>(
                    <button
                        key={category?.slug}
                        className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium cursor-pointer"
                        onClick={()=> handleCategoryClick(category)}
                    >
                        {category?.name}
                        {category?.subcategories && category?.subcategories?.length > 0 && (
                            <ChevronRightIcon className="size-4"/>
                        )}
                    </button>
                ))}
            </ScrollArea>
        </SheetContent>
    </Sheet>
  )
}

export default CategoriesSidebar