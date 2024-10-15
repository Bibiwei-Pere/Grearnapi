"use client";
import { Switch } from "@/components/ui/switch";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { notificationsSchema } from "../schema/Forms";
import { useGetUser, useUpdateUser } from "@/hooks/users";

const Notifications = () => {
  const { data: user } = useGetUser();
  const { mutation } = useUpdateUser();

  const form = useForm<z.infer<typeof notificationsSchema>>({
    resolver: zodResolver(notificationsSchema),
  });

  useEffect(() => {
    if (user) {
      // Populate form with values from user data
      form.reset({
        updates: user.notifications?.updates || {},
        reminders: user.notifications?.reminders || {},
        others: user.notifications?.others || {},
      });
    }
  }, [user, form]);

  const onSubmit = (values: z.infer<typeof notificationsSchema>) => {
    mutation.mutate({
      userId: user._id,
      notifications: {
        ...values,
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col'>
        <div className='border-b pt-10 pb-5 border-[#EAECF01A] justify-self-start'>
          <h6>Notification settings</h6>
          <p className='my-[5px] text-sm '>
            We may still send you important notifications about your account outside of your notification settings.
          </p>
        </div>

        {/* Updates Section */}
        <NotificationSection
          form={form}
          title='Updates'
          description='These are notifications for the latest updates on your account.'
          field='updates'
        />

        {/* Reminders Section */}
        <NotificationSection
          form={form}
          title='Reminders'
          description='These are notifications to remind you of updates you might have missed.'
          field='reminders'
        />

        {/* Others Section */}
        <NotificationSection
          form={form}
          title='More activity about you'
          description='These are notifications for new courses posted on the platform.'
          field='others'
        />

        {/* Save Button */}
        <Button type='submit' variant={"ghost"} className='mt-6 ml-0'>
          Save Changes
        </Button>
      </form>
    </Form>
  );
};

const NotificationSection = ({ title, description, field, form }: any) => {
  return (
    <div className='flex flex-col gap-[15px] px-[30px] border-b py-6 border-[#EAECF01A]'>
      <div className='flex items-start justify-between gap-5 max-w-[516px]'>
        <div className='max-w-[280px]'>
          <h6>{title}</h6>
          <p>{description}</p>
        </div>
        <div className='flex flex-col gap-3'>
          <FormField
            control={form.control}
            name={`${field}.push`}
            render={({ field }) => (
              <FormItem className='flex items-center gap-2'>
                <FormLabel>Push</FormLabel>
                <Controller
                  control={form.control}
                  name={`${field.name}`}
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${field}.email`}
            render={({ field }) => (
              <FormItem className='flex items-center gap-2'>
                <FormLabel>Email</FormLabel>
                <Controller
                  control={form.control}
                  name={`${field.name}`}
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${field}.sms`}
            render={({ field }) => (
              <FormItem className='flex items-center gap-2'>
                <FormLabel>SMS</FormLabel>
                <Controller
                  control={form.control}
                  name={`${field.name}`}
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
