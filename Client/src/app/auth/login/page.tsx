"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Google from "../../components/assets/images/auth/google.svg";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/app/components/schema/Forms";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, ErrorModal } from "@/components/ui/alert-dialog";
import { ContainerAuth } from "@/components/ui/containers";
import { WrapperAuth } from "@/components/ui/wrappers";
import { useLogin } from "@/hooks/auth";
import { signIn } from "next-auth/react";

const Login = () => {
  const [errorModal, setErrorModal] = useState(false);
  const { mutation, response } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutation.mutate(values);
  };

  React.useEffect(() => {
    if (mutation.isError) setErrorModal(true);
  }, [mutation.isError]);

  return (
    <ContainerAuth>
      <WrapperAuth>
        <h1>Welcome back</h1>
        <p className='text-center'>Login to your account</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input type='email' placeholder='john.doe@example.com' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type='password' placeholder='Password must be atleast 6 characters' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link href='reset-password'>Fogot Password?</Link>
            <Button variant={"ghost"} className='w-full mt-5 mb-3' type='submit' disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Log In"}
            </Button>
            <div className='max-w-[414px] w-full mx-auto grid items-center gap-8 grid-cols-[1fr_10px_1fr]'>
              <span className='bg-white h-px'></span>
              <h6>Or</h6>
              <span className='bg-white h-px'></span>
            </div>
            <div className='max-w-[414px] flex justify-between mx-auto w-full gap-2'>
              <Button
                type='button'
                onClick={async () =>
                  await signIn("google", {
                    callbackUrl: "/dashboard",
                  })
                }
                className='w-full gap-2'
                variant={"ghost"}
              >
                <Image src={Google} alt='Envelope' />
                <p className='hidden sm:block'>Sign in with Google</p>
              </Button>
            </div>
          </form>
        </Form>
      </WrapperAuth>
      {errorModal && (
        <AlertDialog open onOpenChange={(open) => setErrorModal(open)}>
          <ErrorModal description={response}>
            <AlertDialogAction className='hover:bg-black hover:text-white'>Close</AlertDialogAction>
          </ErrorModal>
        </AlertDialog>
      )}
    </ContainerAuth>
  );
};

export default Login;
