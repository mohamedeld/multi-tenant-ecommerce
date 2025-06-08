import { headers as getHeaders,cookies as getCookies } from "next/headers";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { AUTH_COOKIE } from "../constants";

export const authRouter = createTRPCRouter({
    session:baseProcedure.query(async ({ctx})=>{
        const headers = await getHeaders();
        const session = await ctx.payload.auth({headers})
        return session
    }),
    register: baseProcedure
        .input(
            z.object({
                email: z.string().email(),
                username: z.string()
                    .min(3, { message: "Username must be at least 3 characters" })
                    .max(63, { message: "Username must be less than 63 characters" })
                    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, { message: "Username must start and end with a letter or number, and can only contain letters, numbers, and dashes." })
                    .refine((val) => !val?.includes("--"), { message: "Username cannot contain consecutive dashes." })
                    .transform((val) => val.toLowerCase()),
                password: z.string().min(6).max(100)
            })
        )
        .mutation(async ({ input, ctx }) => {
            const existingData = await ctx.payload.find({
                collection:"users",
                limit:1,
                where:{
                    username:{
                        equals:input.username
                    }
                }
            })
            if(existingData?.docs[0]){
                throw new TRPCError({
                    code:"BAD_REQUEST",
                    message:"Username already exist"
                })
            }
            const tenant = await ctx.payload.create({
                collection:"tenants",
                data:{
                    name:input?.username,
                    slug:input?.username,
                    stripeAccountId:"test",
                }
            })

            await ctx.payload.create({
                collection: "users",
                data: {
                    email: input.email,
                    username: input.username,
                    password: input.password,
                    tenants:[
                        {
                            tenant:tenant?.id
                        }
                    ]
                }
            })
            const data = await ctx.payload.login({
            collection:"users",
            data:{
                email:input.email,
                password:input.password
            }
        })
        if(!data?.token){
            throw new TRPCError({
                code:"UNAUTHORIZED",
                message:"Invalid email or password"
            })
        }
        const cookies = await getCookies();
        cookies.set({
            name:AUTH_COOKIE,
            value:data?.token,
            httpOnly:true,
            path:"/",
            secure:process.env.NODE_ENV === "production",
            sameSite:"lax",
            maxAge:60 * 60 * 24 * 7
        })
        // return data;
        }),
    
        logout:baseProcedure.mutation(async ()=>{
            const cookies = await getCookies();
            cookies.delete(AUTH_COOKIE)
        }),
    login:baseProcedure.input(
        z.object({
            email: z.string().email(),
        password: z.string().min(6).max(100)
        })
    ).mutation(async ({input,ctx})=>{
        const data = await ctx.payload.login({
            collection:"users",
            data:{
                email:input.email,
                password:input.password
            }
        })
        if(!data?.token){
            throw new TRPCError({
                code:"UNAUTHORIZED",
                message:"Invalid email or password"
            })
        }
        const cookies = await getCookies();
        cookies.set({
            name:AUTH_COOKIE,
            value:data?.token,
            httpOnly:true,
            path:"/",
            secure:process.env.NODE_ENV === "production",
            sameSite:"lax",
            maxAge:60 * 60 * 24 * 7
        })
        return data;
    })
})