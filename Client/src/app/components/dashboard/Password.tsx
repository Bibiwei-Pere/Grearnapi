"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { formSchemaPassword } from "../schema/Forms";
import { useGetUser, useUpdateUser } from "@/hooks/users";

const Password = () => {
  const form = useForm<z.infer<typeof formSchemaPassword>>({
    resolver: zodResolver(formSchemaPassword),
  });

  const { mutation } = useUpdateUser();
  const { data: user } = useGetUser();

  const onSubmit = (values: z.infer<typeof formSchemaPassword>) => {
    mutation.mutate({
      userId: user?._id,
      passwordReset: {
        password: values.password,
        confirmPassword: values.confirmPassword,
        currentPassword: values.currentPassword,
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col'>
        <div className='border-b pt-10 pb-5 border-[#EAECF01A] justify-self-start'>
          <h6>Password</h6>
          <p className='my-[5px] text-sm '>Please enter your current password to change your password.</p>
        </div>
        <div className='flex flex-col gap-[15px] px-[30px] border-b py-6 border-[#EAECF01A]'>
          <div className='flex items-start justify-between gap-5 max-w-[1016px]'>
            <h6 className='w-full'>Current password</h6>
            <div className='flex flex-col w-full'>
              <FormField
                control={form.control}
                name='currentPassword'
                render={({ field }) => (
                  <FormItem>
                    <Input placeholder='*******' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-[15px] px-[30px] border-b py-6 border-[#EAECF01A]'>
          <div className='flex items-start justify-between gap-5 max-w-[1016px]'>
            <h6 className='w-full'>New password</h6>
            <div className='flex flex-col w-full'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <Input placeholder='*******' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className='mt-2'>Your new password must be different from the current password.</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-[15px] px-[30px] border-b py-6 border-[#EAECF01A]'>
          <div className='flex items-start justify-between gap-5 max-w-[1016px]'>
            <h6 className='w-full'>Password</h6>
            <div className='flex flex-col w-full'>
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <Input placeholder='*******' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className='flex w-full justify-end items-end'>
          <div className='flex gap-3 mt-10'>
            <Button>Cancel</Button>
            <Button variant={"ghost"} className='bg-[#FFFFFF1A]'>
              Update password
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default Password;
