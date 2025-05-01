import type {CollectionConfig} from "payload"

export const Brands:CollectionConfig = {
    slug:'brands',
    fields:[
        {
            name:'name',
            type:'text',
            required:true
        }
    ]
}