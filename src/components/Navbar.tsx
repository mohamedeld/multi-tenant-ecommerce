"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import NavbarSidebar from "./NavbarSidebar";
import { Menu } from "lucide-react";

interface NavbarItemProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
}

const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
  return (
    <Link href={href}>
      <Button
        variant={"outline"}
        className={cn(
          "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg ",
          isActive && "bg-black text-white hover:bg-black hover:text-white"
        )}
      >
        {children}
      </Button>
    </Link>
  );
};

const navbarItems = [
  {
    href: "/",
    children: "Home",
  },
  {
    href: "/about",
    children: "About",
  },
  {
    href: "/features",
    children: "Features",
  },
  {
    href: "/pricing",
    children: "Pricing",
  },
  {
    href: "/contact",
    children: "Contact",
  },
];

const Navbar = () => {
  const pathname = usePathname();
const [isSidebarOpen,setIsSidebarOpen] = useState(false);

  return (
    <nav className="h-20 flex border-b justify-between font-medium bg-white">
      <Link href={"/"} className="pl-6 flex items-center">
        <span className={cn("text-5xl font-medium")}>funroad</span>
      </Link>
      <NavbarSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} items={navbarItems}/>
      <div className="items-center gap-4 hidden lg:flex">
        {navbarItems?.map((item) => (
          <NavbarItem
            key={item?.children}
            href={item?.href}
            isActive={item?.href === pathname}
          >
            {item?.children}
          </NavbarItem>
        ))}
      </div>
      <div className="hidden lg:flex">
        <Button
          asChild
          variant={"secondary"}
          className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
        >
          <Link href={"/sign-in"}>Login</Link>
        </Button>
        <Button asChild className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg">
          <Link href={"/sign-up"}>Start selling</Link>
        </Button>
      </div>
      <div className="flex lg:hidden items-center justify-center">
        <Button variant={"ghost"} className="size-12 border-transparent bg-white" onClick={()=> setIsSidebarOpen(true)}>
            <Menu/>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
