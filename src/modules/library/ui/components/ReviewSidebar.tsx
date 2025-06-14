"use client";
import { useTRPC } from "@/trpc/client";
import {  useSuspenseQuery } from "@tanstack/react-query";
import ReviewForm from "./ReviewForm";

interface IProps{
    productId:string;
}
const ReviewSidebar = ({productId}:IProps) => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.reviews.getOne.queryOptions({
        productId
    }))
  return (
    <ReviewForm
        productId={productId}
        initialData={data}
    />
  )
}

export default ReviewSidebar