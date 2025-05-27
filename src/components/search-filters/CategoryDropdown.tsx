"use client";
import { Category } from "@/payload-types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useDropdownPosition } from "./use-dropdown-position";
import SubcategoryMenu from "./SubcategoryMenu";
import { CustomCategory } from "@/app/(app)/(home)/types";
import Link from "next/link";

interface IProps {
  category: CustomCategory;
  isActive?: boolean;
  isNavigationHovered?: boolean;
}
const CategoryDropdown = ({
  category,
  isActive,
  isNavigationHovered,
}: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
    const {getDropdownPosition} = useDropdownPosition({ref:dropdownRef})
  const onMouseEnter = () => {
    if (category?.subcategories) {
      setIsOpen(true);
    }
  };
  const onMouseLeave = () => {
    setIsOpen(false);
  };
  const dropdownPosition = getDropdownPosition();

  const toggleDropdown = ()=>{
    if(category?.subcategories?.docs && category?.subcategories?.docs?.length > 0){
        setIsOpen(!isOpen);
    }
  }
  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={toggleDropdown}
    >
      <div className="relative">
        <Button
          variant={"elevated"}
          className={cn(
            "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
            isActive && !isNavigationHovered && "bg-white border-primary",
            isOpen && 'bg-white border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] '
          )}
        >
            <Link  href={`/${category?.slug === 'all' ? "" : category?.slug}`}>
          {category?.name}
            </Link>
        </Button>
        {category?.subcategories && category?.subcategories?.length > 0 && (
            <div className={cn(
                " absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-l-transparent border-solid border-r-transparent border-b-black border-b-[10px] left-1/2 -translate-x-1/2",
                isOpen ? 'opacity-100' : "opacity-0"
            )}/>
        )}
      </div> 
      <SubcategoryMenu 
        category={category}
        isOpen={isOpen}
        dropdownPosition={dropdownPosition}  
    />
    </div>
  );
};

export default CategoryDropdown;
