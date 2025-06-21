import {  Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";
import { CheckoutMetadata, ProductMetadata } from "../types";
import { stripe } from "@/lib/stripe";
import { PLATFORM_FREE_PERCENTAGE } from "@/modules/auth/constants";
export const checkoutRouters = createTRPCRouter({
    verify:protectedProcedure.mutation(async ({ctx})=>{
        const user = await ctx.payload.findByID({
            collection:"users",
            id:ctx.session.user?.id,
            depth:0
        });
        if(!user){
            throw new TRPCError({
                code:"NOT_FOUND",
                message:"user not found"
            })
        }
        const tenantId = user?.tenants?.[0]?.tenant as string;
        const tenant = await ctx.payload.findByID({
            collection:"tenants",
            id:tenantId
        });
        console.log("tetn ",tenant);
         if(!tenant){
            throw new TRPCError({
                code:"NOT_FOUND",
                message:"tenant not found"
            })
        }
        const accountLink = await stripe.accountLinks.create({
            account:tenant?.stripeAccountId,
            refresh_url:`${process.env.NEXT_PUBLIC_APP_URL}/admin`,
            return_url:`${process.env.NEXT_PUBLIC_APP_URL}/admin`,
            type:"account_onboarding"
        })
        console.log("acc",accountLink)
        if(!accountLink?.url){
            throw new TRPCError({
                code:"BAD_REQUEST",
                message:"Failed to create verification link"
            })
        }
        return {
            url:accountLink?.url
        }
    }),
  purchase:protectedProcedure.input(
    z.object({
        productIds:z.array(z.string()).min(1),
        tenantSlug:z.string().min(1)
    })
  ).mutation(async ({ctx,input})=>{
    const products = await ctx.payload.find({
        collection:"products",
        where:{
            and:[
                {
                    id:{
                in:input?.productIds
            }
                },
                {
                    "tenant.slug":{
                        equals:input?.tenantSlug
                    }
                }
            ]
        }
    })
    if(products?.totalDocs !== input?.productIds?.length){
        throw new TRPCError({
            code:"NOT_FOUND",
            message:"Products not found"
        })
    }
    const tenantsData = await ctx.payload.find({
        collection:"tenants",
        limit:1,
        pagination:false,
        where:{
            slug:{
                equals:input?.tenantSlug
            }
        }
    });
    const tenant = tenantsData?.docs[0];
    if(!tenant){
        throw new TRPCError({
            code:"NOT_FOUND",
            message:"Tenant not found"
        })
    }
    if(!tenant?.stripeDetailsSubmitted){
        throw new TRPCError({
            code:"BAD_REQUEST",
            message:"Tenant not allowed to sell products"
        })
    }
    const lineItems:Stripe.Checkout.SessionCreateParams.LineItem[] = products?.docs?.map((product)=>({
        quantity:1,
        price_data:{
            unit_amount:product?.price * 100,
            currency:"usd",
            product_data:{
                name:product?.name,
                metadata:{
                    stripeAccountId:tenant?.stripeAccountId,
                    id:product?.id,
                    name:product?.name,
                    price:product?.price
                } as ProductMetadata
            }
        }
    }));
    const totalAmount = products?.docs?.reduce((acc,item)=> acc+item?.price * 100,0);
    const plaformFeeAmount = Math.round(totalAmount * (PLATFORM_FREE_PERCENTAGE / 100));



    const checkout = await stripe.checkout.sessions.create({
        customer_email:ctx?.session?.user?.email,
        success_url:`${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input?.tenantSlug}/checkout?success=true`,
        cancel_url:`${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input?.tenantSlug}/checkout?cancel=true`,
        mode:"payment",
        line_items:lineItems,
        invoice_creation:{
            enabled:true
        },
        metadata:{
            userId:ctx?.session?.user?.id
        } as CheckoutMetadata,
        payment_intent_data:{
            application_fee_amount:plaformFeeAmount
        }
    },{
        stripeAccount:tenant?.stripeAccountId
    })
    if(!checkout?.url){
        throw new TRPCError({
            code:"INTERNAL_SERVER_ERROR",
            message:"Failed to create checkout session"
        })
    }
    return {
        url:checkout?.url
    }
  }),
  getProducts: baseProcedure
    .input(
      z.object({
        ids:z.array(z.string())
      })
    )
    .query(async ({ ctx, input }) => {
      
      const data = await ctx.payload.find({
        collection: "products",
        pagination: false,
        depth: 2,
        where:{
            id:{
                in:input?.ids
            }
        }
      });
      if(data?.totalDocs !== input?.ids?.length) {
        throw new TRPCError({
            code:"NOT_FOUND",
            message:"products not found"
        })
      }

      return {
        ...data,
        totalPrice:data?.docs?.reduce((acc,product)=> acc + product?.price , 0),
        docs:data?.docs?.map((doc)=>({
          ...doc,
          image:doc?.image as Media | null,
          tenant:doc?.tenant as Tenant & {image:Media | null},
        }))
      };
    }),
});
