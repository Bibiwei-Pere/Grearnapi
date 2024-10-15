"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Pen, XCircle } from "lucide-react";
import { AddButtonContainer, Button } from "@/components/ui/button";
import { investmentSchema } from "@/app/components/schema/Forms";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialogCancel, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { usePostInvestment, useUpdateInvestment, useDeleteInvestment } from "@/hooks/investment";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadSingle } from "./FileUpload";

export const NewInvestment = ({ data, edit }: any) => {
  const { data: session } = useSession();
  const { mutation: update } = useUpdateInvestment();
  const { mutation: post } = usePostInvestment();
  const [image, setImage] = useState<any>({});
  const [editImage, setEditImage] = useState(false);

  const handleUploadImage = (response: any) => {
    setImage(response);
    setEditImage(false);
  };
  console.log(data);

  const onSubmit = (values: z.infer<typeof investmentSchema>) => {
    const imageData = {
      url: image.signedUrl,
      name: image.uniqueName,
      fileId: image.fileId,
    };

    console.log(imageData);
    if (edit === "edit") {
      update.mutate({
        userId: session?.user?.id,
        image: imageData,
        ...values,
      });
    } else
      post.mutate({
        userId: session?.user?.id,
        image: imageData,
        ...values,
      });
  };

  const form = useForm<z.infer<typeof investmentSchema>>({
    resolver: zodResolver(investmentSchema),
  });

  console.log(form.formState.errors);

  useEffect(() => {
    if (session) {
      if (edit === "edit")
        form.reset({
          product: data?.product || "",
          geo_location: data?.geo_location || "",
          roi: data?.roi.toString() || "",
          minimum_invest: data?.minimum_invest.toString() || "",
          info: data?.info || "",
          isActive: data?.isActive ? "Published" : "Archived",
          gain: data?.gain.toString() || "User",
          duration: data?.duration.toString() || "Nigeria",
        });
    }
  }, [session]);
  console.log(data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <div className='flex mb-10 justify-between items-center'>
          <h6>Create New Investment</h6>
          <AlertDialogCancel>
            <XCircle />
          </AlertDialogCancel>
        </div>

        <FormField
          control={form.control}
          name='product'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Product</FormLabel>
              <Input placeholder='Enter Product' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='geo_location'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Geo Location</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={cn(!field.value && "text-gray-400")}>
                  <SelectValue placeholder='Select Geo location' />
                </SelectTrigger>
                <SelectContent>
                  {geopoliticalZones.map((zones: string) => (
                    <SelectItem value={zones}>{zones}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className='grid grid-cols-2 gap-3'>
          <FormField
            control={form.control}
            name='duration'
            render={({ field }) => (
              <FormItem className='mt-2'>
                <FormLabel>Duration</FormLabel>
                <Input pattern={REGEXP_ONLY_DIGITS} placeholder='Enter Duration' {...field} />
                <FormMessage className='relative top-1' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='roi'
            render={({ field }) => (
              <FormItem className='mt-2'>
                <FormLabel>ROI</FormLabel>
                <Input pattern={REGEXP_ONLY_DIGITS} placeholder='Enter ROI' {...field} />
                <FormMessage className='relative top-1' />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <FormField
            control={form.control}
            name='minimum_invest'
            render={({ field }) => (
              <FormItem className='mt-2'>
                <FormLabel>Minimum_invest</FormLabel>
                <Input pattern={REGEXP_ONLY_DIGITS} placeholder='Enter Minimum_invest' {...field} />
                <FormMessage className='relative top-1' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='gain'
            render={({ field }) => (
              <FormItem className='mt-2'>
                <FormLabel>Gain</FormLabel>
                <Input pattern={REGEXP_ONLY_DIGITS} placeholder='Enter Gain' {...field} />
                <FormMessage className='relative top-1' />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='info'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Info</FormLabel>
              <Textarea placeholder='Enter Info' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='isActive'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={cn(!field.value && "text-gray-400")}>
                  <SelectValue placeholder='Archived' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Published'>Published</SelectItem>
                  <SelectItem value='Archived'>Archived</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {image?.signedUrl || (data?.image?.url && !editImage) ? (
          <AddButtonContainer className='relative h-[300px] overflow-hidden w-full'>
            <div className='w-full absolute top-0'>
              <Pen
                className='cursor-pointer absolute top-2 right-2 h-4 hover:text-yellow-500'
                onClick={() => setEditImage(true)}
              />
              <Image
                src={image.signedUrl || data?.image?.url}
                alt={`file-preview`}
                width={510}
                height={510}
                className='max-w-full rounded-md h-auto'
              />
            </div>
          </AddButtonContainer>
        ) : (
          <div className='w-full relative overflow-hidden pt-6'>
            {editImage && (
              <XCircle
                className='cursor-pointer absolute right-2 top-2 w-5 h-5 hover:text-yellow-500'
                onClick={() => setEditImage(false)}
              />
            )}
            <FileUploadSingle onUploadSuccess={handleUploadImage} />
          </div>
        )}

        <AlertDialogFooter>
          {edit === "edit" ? (
            <Button variant={"success"} className='w-full mt-10'>
              {update.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Update investment"}
            </Button>
          ) : (
            <Button variant={"success"} className='w-full mt-10'>
              {post.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Add investment"}
            </Button>
          )}
        </AlertDialogFooter>
      </form>
    </Form>
  );
};

export const DeleteInvestment = ({ data }: any) => {
  const { mutation } = useDeleteInvestment();
  console.log(data);
  return (
    <div>
      <div className='flex mb-10 justify-between items-center'>
        <h6>Delete Investment</h6>
        <AlertDialogCancel>
          <XCircle />
        </AlertDialogCancel>
      </div>

      <p>By choosing delete, this investment will be permanently deleted from the platform.</p>
      <AlertDialogFooter>
        <Button
          variant={"destructive"}
          onClick={() =>
            mutation.mutate({
              investmentId: data?._id,
            })
          }
          className='w-full mt-10'
        >
          {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Delete"}
        </Button>
      </AlertDialogFooter>
    </div>
  );
};

const geopoliticalZones = [
  "North Central",
  "North East",
  "North West",
  "South East",
  "South South",
  "South West",
] as const;
