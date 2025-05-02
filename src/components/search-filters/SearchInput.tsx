import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

interface IProps{
    disabled?:boolean;
}
const SearchInput = ({disabled}:IProps) => {
  return (
    <div className="flex items-center gap-2 w-full">
        <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 "/>
            <Input className="pl-8 " placeholder="Search products" disabled={disabled}/>
        </div>
        {/* categories view all buttons */}
    </div>
  )
}

export default SearchInput