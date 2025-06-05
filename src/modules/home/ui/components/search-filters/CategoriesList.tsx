"use client"
import { useEffect, useRef, useState } from "react"
import CategoryDropdown from "./CategoryDropdown"
import { CustomCategory } from "@/app/(app)/(home)/types"
import { Button } from "../../../../../components/ui/button"
import { cn } from "@/lib/utils"
import { ListFilterIcon } from "lucide-react"
import CategoriesSidebar from "./CategoriesSidebar"
import { useParams } from "next/navigation"

interface IProps{
    data:CustomCategory[]
}
const CategoriesList = ({data}:IProps) => {
    const params = useParams();
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const viewAllRef = useRef<HTMLDivElement>(null);
    const [visibleCount,setVisibleCount] = useState(data?.length);
    const [isAnyHover,setIsAnyHover] = useState(false);
    const [isSidebarOpen,setIsSidebarOpen] = useState(false);
    const categoryParams = params?.category as string | undefined;

    const activeCategory = categoryParams || "all";
    const activeCategoryIndex = data?.findIndex(category=> category?.slug === activeCategory);
    const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

    useEffect(()=>{
        const calculateVisible = ()=>{
            if(!containerRef?.current || !measureRef?.current || !viewAllRef?.current){
                return;
            }
            const containerWidth = containerRef?.current?.offsetWidth;
            const viewAllWidth = viewAllRef?.current?.offsetWidth;
            const availableWidth = containerWidth - viewAllWidth;

            const items = Array.from(measureRef?.current?.children);
            let totalWidth = 0;
            let visible = 0;

            for(const item of items){
                const width = item?.getBoundingClientRect()?.width;
                if(totalWidth + width > availableWidth) break;
                totalWidth += width;
                visible++;
            }
            setVisibleCount(visible);
        }
        const resizeObserver = new ResizeObserver(calculateVisible);
        resizeObserver.observe(containerRef?.current!);
        return ()=>{
            resizeObserver.disconnect();
        }
    },[data?.length])
  return (
    <div className="w-full relative">
        <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen}/>
    <div ref={measureRef} className="absoulte opacity-0 pointer-events-none flex" style={{
        position:"fixed",
        top:-9999,
        left:-9999
    }}>

        {data?.map((category:CustomCategory)=>{
            return (
                <div key={category?.id}>
                    <CategoryDropdown category={category} isActive={activeCategory === category?.slug} isNavigationHovered={false}/>
                </div>
            )
        })}
        </div>
        <div 
            ref={containerRef}
            onMouseEnter={()=> setIsAnyHover(true)}
            onMouseLeave={()=> setIsAnyHover(false)}
        className="flex items-center gap-3  flex-nowrap">

        {data?.slice(0,visibleCount)?.map((category:CustomCategory)=>{
            return (
                <div key={category?.id}>
                    <CategoryDropdown category={category} isActive={activeCategory === category?.slug} isNavigationHovered={isAnyHover}/>
                </div>
            )
        })}
        <div ref={viewAllRef} className="shrink-0">
            <Button variant={"elevated"} className={cn("h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
            isActiveCategoryHidden && !isAnyHover && "bg-white border-primary")} onClick={()=>setIsSidebarOpen(true)}>
                View All 
                <ListFilterIcon className="ml-2"/>
            </Button>
        </div>
        </div>
    </div>
  )
}

export default CategoriesList