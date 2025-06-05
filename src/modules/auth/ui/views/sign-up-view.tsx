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
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const SignUpView = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const register = useMutation(trpc.auth.register.mutationOptions({
    onError:(error)=>{
      toast.error(error?.message)
    },
    onSuccess: async ()=> {
        toast.success("Registered successfully");
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
        router.push("/")
    },
  }));

  const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        mode:"all",
        defaultValues:{
          username:"",
          email:"",
          password:""
        }
    })
    const onSubmit = (data: z.infer<typeof registerSchema>) => {
      register.mutate(data);
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
            <FormField
              name="email"
              render={({field})=>(
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({field})=>(
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password"/>
                  </FormControl>
                 
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button disabled={register.isPending} type="submit" size={"lg"} variant={"elevated"}
            className="bg-black text-white hover:bg-pink-400 hover:text-primary"
              >{register.isPending ? 'Creating...':'Create Account'}</Button>

            </form>
        </Form>
      </div>
      <div className="h-screen w-full lg:col-span-2 hidden lg:block" style={{backgroundImage: "url('/images/shop.jpg')", backgroundSize: "cover", backgroundPosition: "center"}}>
      </div>
    </div>
  )
}

export default SignUpView