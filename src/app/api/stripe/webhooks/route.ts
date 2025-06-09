import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { ExpandedLineItem } from "@/modules/checkout/types";


export async function POST(req:Request){
    let event: Stripe.Event;
    try{
        event = stripe.webhooks.constructEvent(
            await (await req.blob()).text(),
            req.headers.get('stripe-signature') as string,
            process.env.STRIPE_WEBHOOK_SECURE as string
        )
    }catch(error){
        const errorMessage = error instanceof Error ? error?.message : "unknown error";
        if(error! instanceof Error){
            console.log(error);
        }
        return NextResponse.json({
            message:`Webhook Error ${errorMessage}`
        },{status:400})
    }
    console.log("Sucess",event?.id);
    const permittedEvents:string[] = [
        "checkout.session.completed",
    ]
    const payload = await getPayload({config});
    if(permittedEvents?.includes(event?.type)){
        let data;
        try{
            switch(event?.type){
                case "checkout.session.completed":
                    data = event?.data?.object as Stripe.Checkout.Session;

                    if(!data?.metadata?.userId){
                        throw new Error("user id is required")
                    }
                    const user = await payload.findByID({
                        collection:"users",
                        id:data?.metadata?.userId
                    });
                    if(!user){
                        throw new Error("user id is required")
                    }
                    const expandedSEssion = await stripe.checkout.sessions.retrieve(data?.id,{
                        expand:["line_items.data.price.product"]
                    });
                    if(!expandedSEssion?.line_items?.data || !expandedSEssion?.line_items?.data?.length){
                        throw new Error("No line items found");
                    }
                    const lineItems= expandedSEssion?.line_items?.data as ExpandedLineItem[];
                    for(const item of lineItems){
                        await payload.create({
                            collection:"orders",
                            data:{
                                stripeCheckoutSessionOd:data?.id,
                                user:user?.id,
                                product:item?.price?.product?.metadata?.id,
                                name:item?.price?.product?.name
                            }
                        })
                    }
                    break;
                default:
                    throw new Error(`Unhandled event: ${event?.type}`)
            }
        }catch(error){
            console.log(error);
            return NextResponse.json({
                message:`Webhook handler failed`
            },{status:500})
        }
    }
    return NextResponse.json({
        message:"Received"
    },{status:200})
}