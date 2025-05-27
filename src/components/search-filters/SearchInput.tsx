"use client";

import { ListFilterIcon, SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { CustomCategory } from "@/app/(app)/(home)/types";
import CategoriesSidebar from "./CategoriesSidebar";
import { useState } from "react";
import { Button } from "../ui/button";

interface IProps{
    disabled?:boolean;
    data:CustomCategory[];
}
const SearchInput = ({disabled,data}:IProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex items-center gap-2 w-full">
        <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} data={data}/>
        <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 "/>
            <Input className="pl-8 " placeholder="Search products" disabled={disabled}/>
        </div>
        {/* categories view all buttons */}
        <Button
            variant="elevated"
            className="size-12 shrink-0 flex lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
        >
            <ListFilterIcon/>
        </Button>
    </div>
  )
}

export default SearchInput