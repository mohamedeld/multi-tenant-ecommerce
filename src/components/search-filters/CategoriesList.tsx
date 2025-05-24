"use client"
import { useEffect, useRef, useState } from "react"
import CategoryDropdown from "./CategoryDropdown"
import { CustomCategory } from "@/app/(app)/(home)/types"

interface IProps{
    data:CustomCategory[]
}
const CategoriesList = ({data}:IProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const viewAllRef = useRef<HTMLDivElement>(null);
    const [visibleCount,setVisibleCount] = useState(data?.length);
    const [isAnyHover,setIsAnyHover] = useState(false);
    const [isSidebarOpen,setIsSidebarOpen] = useState(false);
    const activeCategory = "all";
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
        resizeObserver?.observe(containerRef?.current!);
        return ()=>{
            resizeObserver.disconnect();
        }
    },[data?.length])
  return (
    <div className="w-full relative">
        <div className="flex items-center gap-3  flex-nowrap">

        {data?.map((category:CustomCategory)=>{
            return (
                <div key={category?.id}>
                    <CategoryDropdown category={category} isActive={activeCategory === category?.slug} isNavigationHovered={false}/>
                </div>
            )
        })}
        </div>
    </div>
  )
}

export default CategoriesList