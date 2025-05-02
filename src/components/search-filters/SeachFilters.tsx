import SearchInput from "./SearchInput"
import CategoriesList from "./CategoriesList"

interface IProps{
    data:any
}
const SeachFilters = ({data}:IProps) => {
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
        <SearchInput/>
        <CategoriesList data={data}/>
    </div>
  )
}

export default SeachFilters