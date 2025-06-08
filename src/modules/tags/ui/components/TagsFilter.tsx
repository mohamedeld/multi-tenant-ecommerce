"use client";

import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LIMIT } from "../../constants";
import { LoaderIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface IProps{
    tags?:string[] | null;
    onChange:(value:string[])=>void;
}

const TagsFilter = ({tags,onChange}:IProps) => {
    const trpc = useTRPC();
    const {data,isLoading,fetchNextPage,hasNextPage,isFetchingNextPage} = useInfiniteQuery(trpc.tags.getMany.infiniteQueryOptions({
        limit:LIMIT
    },{
        getNextPageParam:(lastPage)=>{
            return lastPage?.docs?.length > 0 ? lastPage?.nextPage : undefined
        }
    }))

    const handleClick = (tag:string)=>{
        if(tags?.includes(tag)){
            onChange(tags?.filter((t)=> t !== tag) || [])
        }else{
            onChange([...(tags || []),tag])
        }
    }

    return (
    <div className="flex flex-col gap-y-2">
        {isLoading ? <div className="flex items-center justify-center p-4">
            <LoaderIcon className="size-4 animate-spin"/>
        </div> : (
            data?.pages?.map((page)=> page?.docs?.map((tag)=>(
                <div key={tag?.id} className="flex items-center justify-between cursor-pointer" onClick={()=>handleClick(tag?.name)}>
                    <p className="font-medium">{tag?.name}</p>
                    <Checkbox
                        checked={tags?.includes(tag?.name)}
                        onCheckedChange={()=>handleClick(tag?.name)}
                    />
                </div>
            )))
        )}
        {hasNextPage && (
            <button disabled={isFetchingNextPage} onClick={()=> fetchNextPage()} className="underline font-medium justify-start text-start disabled:opacity-50">Load more</button>
        )}
    </div>
  )
}

export default TagsFilter