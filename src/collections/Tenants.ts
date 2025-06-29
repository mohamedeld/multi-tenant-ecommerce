import { isSuperAdmin } from '@/lib/access'
import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    {
      name:"name",
      required:true,
      type:"text",
      label:"Store Name",
      admin:{
        description:"This is the name of the store (e.g. Mohamed's Store)"
      }
    },
    {
        name:"slug",
        type:"text",
        unique:true,
        required:true,
        index:true,
        admin:{
            description:"This is the subdomain for the store (e.g. [slug].funroad.com)"
        }
    },
    {
        name:"image",
        type:"upload",
        relationTo:"media"
    },
    {
        name:"stripeAccountId",
        type:"text",
        required:true,
        access:{
          update:({req})=> isSuperAdmin(req?.user)
        },
        admin:{
          readOnly:true,
          description:"Stripe account id associated with your shop"
        }
    },{
        name:"stripeDetailsSubmitted",
        type:"checkbox",
        access:{
          update:({req})=> isSuperAdmin(req?.user)
        },
        admin:{
            readOnly:true,
            description:"You cannot create products until you submit your Stripe details"
        }
    },
  ],
}
