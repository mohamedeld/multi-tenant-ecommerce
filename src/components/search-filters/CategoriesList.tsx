import { Category } from "@/payload-types"
import CategoryDropdown from "./CategoryDropdown"

interface IProps{
    data:any
}
const CategoriesList = ({data}:IProps) => {
  return (
    <div className="w-full relative">
        <div className="flex items-center gap-3  flex-nowrap">

        {data?.map((category:Category)=>{
            return (
                <div key={category?.id}>
                    <CategoryDropdown category={category} isActive={false} isNavigationHovered={false}/>
                </div>
            )
        })}
        </div>
    </div>
  )
}

export default CategoriesList