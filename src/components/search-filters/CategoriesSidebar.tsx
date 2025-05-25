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

interface IProps{
    open:boolean;
    onOpenChange:React.Dispatch<React.SetStateAction<boolean>>;
    data:CustomCategory[];
}
const CategoriesSidebar = ({open,onOpenChange,data}:IProps) => {
    const [parentCategories,setParentCategories] = useState<CustomCategory[] | null>(null);
    const [selectedCategory,setSelectedCategory] = useState<CustomCategory | null>(null);

    const currentCategories = parentCategories ?? data ?? [];
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0 transition-none" style={{backgroundColor:"white"}}>
            <SheetHeader className="p-4 border-b">
                <SheetTitle>Categories</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                
            </ScrollArea>
        </SheetContent>
    </Sheet>
  )
}

export default CategoriesSidebar