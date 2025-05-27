import SearchInput from "./SearchInput"
import CategoriesList from "./CategoriesList"
import { CustomCategory } from "@/app/(app)/(home)/types"

interface IProps{
    data:CustomCategory[]
}
const SeachFilters = ({data}:IProps) => {
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
        <SearchInput data={data}/>
        <CategoriesList data={data}/>
    </div>
  )
}

export default SeachFilters