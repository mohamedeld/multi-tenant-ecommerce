import {   useQueryStates} from "nuqs";
import {createLoader,parseAsString,parseAsArrayOf,parseAsStringLiteral} from "nuqs/server";

export const sortValues = ["created","trending","hot_and_new"] as const;

const params = {
  sort:parseAsStringLiteral(sortValues).withDefault("created"),
  minPrice:parseAsString.withOptions({clearOnDefault:true}).withDefault(""),
    maxPrice:parseAsString.withOptions({clearOnDefault:true}).withDefault(""),
    tags:parseAsArrayOf(parseAsString).withOptions({
      clearOnDefault:true
    }).withDefault([])
}
export const useProductFilters = () => {
  return useQueryStates(params)
}


export const loadProductFilters = createLoader(params);
