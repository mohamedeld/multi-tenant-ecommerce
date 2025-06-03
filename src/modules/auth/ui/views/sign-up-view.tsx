"use client";
import { useForm } from "react-hook-form"
import { registerSchema } from "../../schemas"
import { z } from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";


const SignUpView = () => {
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues:{
          username:"",
          email:"",
          password:""
        }
    })
    const onSubmit = (data: z.infer<typeof registerSchema>) => {

    }
    const username = form.watch("username");
    const usernameErrors = form.formState.errors.username;
    const showPreview = username && !usernameErrors;


  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#f4f4f0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 p-4 lg:p-16">
            <div className="flex items-center justify-between mb-8">
              <Link href="/">
                <span className="text-2xl font-semibold">funroad</span>
              </Link>
              <Button asChild variant={"ghost"} size="sm" className="text-base border-none underline">
                <Link prefetch href="/sign-in">
                    Sign in
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-medium">
              Join over 10,000 creators earning money on funroad
            </h1>
            <FormField
              name="username"
              render={({field})=>(
                <FormItem>
                  <FormLabel className="text-base">Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription className={cn("hidden",showPreview && "block")}>
                    Your store will be available at <strong>{username}</strong>
                  </FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />
            </form>
        </Form>
      </div>
      <div className="h-screen w-full lg:col-span-2 hidden lg:block" style={{backgroundImage: "url('/images/shop.jpg')", backgroundSize: "cover", backgroundPosition: "center"}}>
        Background column
      </div>
    </div>
  )
}

export default SignUpView