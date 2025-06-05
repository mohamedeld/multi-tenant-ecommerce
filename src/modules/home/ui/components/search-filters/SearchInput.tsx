"use client";

import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import { Input } from "../../../../../components/ui/input";
import { CustomCategory } from "@/app/(app)/(home)/types";
import CategoriesSidebar from "./CategoriesSidebar";
import { useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface IProps{
    disabled?:boolean;
}
const SearchInput = ({disabled}:IProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const trpc = useTRPC();
      const session = useQuery(trpc.auth.session.queryOptions());
      console.log(session?.data)
  return (
    <div className="flex items-center gap-2 w-full">
        <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen}/>
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
        {session?.data?.user &&(
            <Button variant={"elevated"} asChild className="">
                <Link href={"/library"}>
                    <BookmarkCheckIcon className="mr-2"/>
                    Library
                </Link>
            </Button>
        )}
    </div>
  )
}

export default SearchInput