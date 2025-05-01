'use client';
import { ReactNode } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";
  
interface NavbarItem {
    href:string;
    children:ReactNode
}

interface IProps{
    items:NavbarItem[];
    open:boolean;
    onOpenChange:(open:boolean)=>void;
}
const NavbarSidebar = ({items,open,onOpenChange}:IProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetTrigger></SheetTrigger>
    <SheetContent side="left" className="p-0 transition-none">
      <SheetHeader className="p-4 border-b">
        <div className="flex items-center">
        <SheetTitle>
            Menu
        </SheetTitle>
        </div>
        <SheetDescription>
        </SheetDescription>
      </SheetHeader>
      <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
        {items?.map((item)=>(
            <Link href={item?.href} key={item?.href} className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium" onClick={()=> onOpenChange(false)}>{item?.children}</Link>
        ))}
        <div className="border-t">
            <Link href={"sign-in" } className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium" onClick={()=> onOpenChange(false)}>Login</Link>
            <Link href={"sign-up"} className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium" onClick={()=> onOpenChange(false)}>Start selling</Link>
        </div>
      </ScrollArea>
    </SheetContent>
  </Sheet>
  
  )
}

export default NavbarSidebar