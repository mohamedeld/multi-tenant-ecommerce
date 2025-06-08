import Footer from "@/modules/tenants/ui/components/Footer";
import Navbar, { NavbarSkeletong } from "@/modules/tenants/ui/components/Navbar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ReactNode, Suspense } from "react"

interface IProps{
    children:ReactNode;
    params:Promise<{
        slug:string
    }>
}
const TenantHomeLayout = async ({params,children}:IProps) => {
    const {slug} = await params;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({
        slug    
    }))
  return (
    <div className='min-h-screen bg-[#f4f4f0] flex flex-col'>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<NavbarSkeletong/>}>
                <Navbar slug={slug}/>
            </Suspense>
        </HydrationBoundary>
        <div className="flex-1">
            <div className="max-w-(--breakpoint-xl) mx-auto">
                {children}
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default TenantHomeLayout