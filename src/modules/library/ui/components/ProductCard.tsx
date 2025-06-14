"use client";
import { generateTenantURL } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface IProps{
    id:string;
    name:string;
    imageUrl?:string | null;
    authorUsername:string;
    reviewRating:number;
    authorImageUrl?:string | null;
    reviewCount:number;
    price:number;
}

const ProductCard = ({id,name,imageUrl,reviewCount,reviewRating,authorUsername,authorImageUrl,price}:IProps) => {
    return (
    <Link prefetch href={`/library/${id}`}>
        <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow border rounded-md bg-white overflow-hidden h-full flex flex-col">
            <div className="relative aspect-square">
                <Image src={imageUrl || "/images/placeholder.png"} alt={name} fill className="object-cover"/>
            </div>
            <div className="p-4 border-y flex flex-col gap-3 flex-1">
                <h2 className="text-lg font-medium line-clamp-4">{name}</h2>
                <div className="flex items-center gap-2">
                    {authorImageUrl && (
                        <Image src={authorImageUrl} alt={authorUsername} width={16} height={16} className="object-cover rounded-full shrink-0 size-[16px]"/>
                    )}
                    <p  className="text-sm underline font-medium">{authorUsername}</p>
                </div>
                {reviewCount > 0 && (
                    <div className="flex items-center gap-1">
                        <StarIcon className="fill-black size-3.5"/>
                        <p className="text-sm font-medium">{reviewRating}  {" "}({reviewCount})</p>
                    </div>
                )}
            </div>
            
        </div>
    </Link>
  )
}

export default ProductCard

export const ProductCardSkeleton = ()=>{
    return (
        <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse"></div>
    )
}