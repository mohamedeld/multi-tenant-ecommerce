"use client";

import StarRating from "@/components/StarRating";
import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

interface IProps {
  productId: string;
  tenantSlug: string;
}
const ProductView = ({ productId, tenantSlug }: IProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    })
  );
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={data?.image?.url || "/images/placeholder.png"}
            alt={data?.name || "cover"}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="col-span-4">
            <div className="p-6">
              <h1 className="text-4xl font-medium">{data?.name}</h1>
            </div>
            <div className="border-y flex">
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <div className="relative px-2 py-1 border bg-pink-400 w-fit">
                  <p className="text-base font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })?.format(Number(data?.price))}
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                <Link
                  href={generateTenantURL(tenantSlug)}
                  className="flex items-center gap-2"
                >
                  {data?.tenant?.image?.url && (
                    <Image
                      src={data?.tenant?.image?.url}
                      alt={data?.tenant?.name}
                      width={20}
                      height={20}
                      className="rounded-full border shrink-0 size-[20px]"
                    />
                  )}
                  <p className="text-base underline font-medium">{data?.tenant?.name}</p>
                </Link>
              </div>
              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                <div className="flex items-center gap-1">
                    <StarRating rating={3}  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
