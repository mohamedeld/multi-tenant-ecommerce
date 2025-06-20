import { isSuperAdmin } from "@/lib/access"
import { Tenant } from "@/payload-types";
import type {CollectionConfig} from "payload"

export const Products:CollectionConfig = {
    slug:'products',
    access:{
      read:()=> true,
      create:({req})=>{
        if(isSuperAdmin(req?.user)){
          return true;
        }
        const tenant = req?.user?.tenants?.[0]?.tenant as Tenant;
        return Boolean(tenant?.stripeDetailsSubmitted)
      }
    },  

    admin:{
      useAsTitle:"name"
    },
    fields:[
        {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "description",
      type: "text",
    },
    {
      name: "price",
      type: "number",
      required: true,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name:"tags",
      relationTo:"tags",
      type:"relationship",
      hasMany:true
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "refundPolicy",
      type: "select",
      options: ["30-days", "14-days", "7-days", "3-day", "no-refunds"],
      defaultValue: "30-days",
    },
    {
      name:"content",
      type:"textarea",
      admin:{
        description:"Protected content only visible to customers after purchase. Add product documentation downloadable files, getting started guides, and bonus materials. Supports Markdown formatting"
      }
    }
    ]
}
