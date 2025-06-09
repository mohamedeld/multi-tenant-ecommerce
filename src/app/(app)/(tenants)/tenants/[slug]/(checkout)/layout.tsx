import Navbar from "@/modules/checkout/ui/components/navbar";
import Footer from "@/modules/tenants/ui/components/Footer";
import { ReactNode, Suspense } from "react"

interface IProps{
    children:ReactNode;
    params:Promise<{
        slug:string
    }>
}
const CheckoutHomeLayout = async ({params,children}:IProps) => {
    const {slug} = await params;
    
  return (
    <div className='min-h-screen bg-[#f4f4f0] flex flex-col'>
        
                <Navbar slug={slug}/>
           
        <div className="flex-1">
            <div className="max-w-(--breakpoint-xl) mx-auto">
                {children}
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default CheckoutHomeLayout