import {   useQueryStates} from "nuqs";
import {createLoader,parseAsString,parseAsArrayOf} from "nuqs/server";

const params = {
  minPrice:parseAsString.withOptions({clearOnDefault:true}),
    maxPrice:parseAsString.withOptions({clearOnDefault:true}),
    tags:parseAsArrayOf(parseAsString).withOptions({
      clearOnDefault:true
    })
}
export const useProductFilters = () => {
  return useQueryStates(params)
}


export const loadProductFilters = createLoader(params);
