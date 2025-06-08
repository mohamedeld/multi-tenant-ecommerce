"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

interface IProps{
    slug:string;
}
const Navbar = ({slug}:IProps) => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.tenants.getOne.queryOptions({
        slug
    }))
  return (
    <div className='border-b h-20 font-medium bg-white'>
        <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center  h-full px-4 lg:px-12">
            <Link href={`/tenants/${data?.slug}`} className="flex items-center gap-2">
            {data?.image?.url && (
                <Image src={data?.image?.url} alt={data?.name} width={32} height={32} className="rounded-full border shrink-0 size-[32px]"/>
            )}
                <p className='text-xl'>{data?.name}</p>
            </Link>
        </div>
    </div>
  )
}

export default Navbar


export const NavbarSkeletong = ()=>{
    return (
        <div className='border-b h-20 font-medium bg-white'>
        <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center  h-full px-4 lg:px-12 animate-pulse">
            <div />
        </div>
    </div>
    )
}