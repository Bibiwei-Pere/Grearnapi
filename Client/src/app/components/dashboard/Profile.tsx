"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import React from "react";
import { Form } from "@/components/ui/form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { profileSchema } from "../schema/Forms";
import { FileUploadSingle } from "./FileUpload";
import Image from "next/image";
import { useGetUser, useUpdateUser } from "@/hooks/users";

const Profile = () => {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<any>({});
  const { data: user } = useGetUser();
  const { mutation } = useUpdateUser();

  const handleUploadSuccess = (response: any) => setUploadedFileUrl(response);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user)
      form.reset({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
      });
  }, [user]);

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    const avatar = {
      name: uploadedFileUrl.uniqueName,
      url: uploadedFileUrl.signedUrl,
      fileId: uploadedFileUrl.fileId,
    };
    const data = {
      ...values,
      userId: user._id, // Attach the uploaded file URL to the form data
      avatar: avatar, // Attach the uploaded file URL to the form data
    };
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <div className='max-w-[640px] mx-auto px-5 py-4 mt-14 mb-10'>
      <h6 className='mb-2'>Personal info</h6>
      <p>Update your photo and personal details here.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='border rounded-lg border-gray-600 mt-9'>
          <div className='flex flex-col gap-5 max-w-full px-6 py-10'>
            <div className='grid grid-cols-2 gap-5'>
              <FormField
                control={form.control}
                name='firstname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <Input type='text' placeholder='Enter your first name' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <Input type='text' placeholder='Enter your last name' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <Input type='email' placeholder={`${user?.email || "Enter your email address"}`} {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-[25px] justify- w-full mt-3'>
              <div className='h-[70px] overflow-hidden w-[85px] mt-2 rounded-full'>
                <Image
                  src={uploadedFileUrl?.signedUrl || user?.avatar?.url || "/noavatar.png"}
                  alt='Avatar'
                  className='w-full h-full'
                  width={300}
                  height={300}
                />
              </div>
              <FileUploadSingle onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>
          <div className='flex border-t border-gray-800 w-full justify-end items-end'>
            <div className='flex gap-3 p-6'>
              <Button>Cancel</Button>
              <Button variant={"ghost"} className='bg-[#FFFFFF1A]'>
                Save
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
