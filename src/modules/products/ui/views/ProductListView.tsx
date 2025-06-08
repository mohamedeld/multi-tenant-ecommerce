import React, { Suspense } from 'react'
import ProductSorted from '../components/ProductSorted'
import ProductFilters from '../components/ProductFilters'
import ProductList, { ProductListSkeleton } from '../components/ProductList'

interface IProps{
    category?:string;
    tenantSlug?:string;
    narrowView?:boolean;
}

const ProductListView = ({category,tenantSlug,narrowView}:IProps) => {
  return (
    <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
          <p className="text-2xl font-medium ">Created for you</p>
          <ProductSorted/>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
          <div className="lg:col-span-2 xl:col-span-2">
            <ProductFilters/>
          </div>
          <div className="lg:col-span-4 xl:col-span-6">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList category={category} tenantSlug={tenantSlug} narrowView={narrowView}/>
            </Suspense>
          </div>
        </div>
      </div>
  )
}

export default ProductListView