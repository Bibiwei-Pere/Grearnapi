"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { CalendarRange, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userSchema } from "@/app/components/schema/Forms";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialogCancel, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDeleteUser, usePostUser, useUpdateUser } from "@/hooks/users";
import { useSession } from "next-auth/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export const NewUser = ({ data, edit }: any) => {
  const { data: session } = useSession();
  const { mutation: update } = useUpdateUser();
  const { mutation: post } = usePostUser();

  const onSubmit = (values: z.infer<typeof userSchema>) => {
    if (edit === "edit") {
      if (values.username === data?.username) delete values.username;
      if (values.email === data?.email) delete values.email;
      update.mutate({
        userId: session?.user?.id,
        ...values,
      });
    } else post.mutate(values);
  };

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });

  console.log(form.formState.errors);

  useEffect(() => {
    if (session) {
      if (edit === "edit")
        form.reset({
          username: data?.username || "",
          firstname: data?.firstname || "",
          lastname: data?.lastname || "",
          email: data?.email || "",
          phone: data?.phone.toString() || "",
          role: data?.role || "User",
          country: data?.country || "Nigeria",
          password: data?.password || "",
          dob: data?.dob || new Date(),
        });
    }
  }, [session]);
  console.log(data);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <div className='flex mb-10 justify-between items-center'>
          <h6>Create New User</h6>
          <AlertDialogCancel>
            <XCircle />
          </AlertDialogCancel>
        </div>

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Username</FormLabel>
              <Input placeholder={data?.username ? data?.username : "Enter Username"} {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='firstname'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Firstname</FormLabel>
              <Input placeholder='Enter Firstname' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastname'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Lastname</FormLabel>
              <Input placeholder='Enter Lastname' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Email</FormLabel>
              <Input placeholder='Enter email' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        {edit === "none" && (
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='mt-2'>
                <FormLabel>Password</FormLabel>
                <Input placeholder='********' {...field} />
                <FormMessage className='relative top-1' />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Phone</FormLabel>
              <Input pattern={REGEXP_ONLY_DIGITS} placeholder='Enter Phone' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={cn(!field.value && "text-gray-400")}>
                  <SelectValue placeholder='Select role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='User'>User</SelectItem>
                  <SelectItem value='Admin'>Admin</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {edit === "edit" && (
          <>
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country of residence</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='secondary'
                        role='combobox'
                        className='rounded-md py-0 px-3 justify-between ml-0 border-gray-800 w-full hover:text-white hover:bg-black'
                      >
                        {field.value
                          ? countries.find((country) => country.name === field.value)?.name
                          : "Select a country"}
                        <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0'>
                      <Command>
                        <CommandInput placeholder='Search countries...' />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {countries.map((country) => (
                              <CommandItem
                                value={country.name}
                                key={country.name}
                                onSelect={() => {
                                  form.setValue("country", country.name);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    country.name === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <Image
                                  src={country.flag}
                                  alt={country.name}
                                  width={50}
                                  height={50}
                                  className='w-5 h-5 mr-3 rounded-full'
                                />
                                {country.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='dob'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='secondary'
                        className='rounded-md py-0 px-3 justify-start ml-0 border-gray-800 w-full'
                      >
                        <CalendarRange className='h-[20px] w-[20px] mr-2' />
                        {field.value ? (
                          new Date(field.value) instanceof Date && !isNaN(new Date(field.value).getTime()) ? (
                            new Date(field.value).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          ) : (
                            <span>Invalid Date</span>
                          )
                        ) : (
                          <span>Select Date of Birth</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date)}
                        disabled={(date) => date < new Date("1960-01-01") || date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <AlertDialogFooter>
          {edit === "edit" ? (
            <Button variant={"success"} className='w-full mt-10'>
              {update.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Update user"}
            </Button>
          ) : (
            <Button variant={"success"} className='w-full mt-10'>
              {post.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Add user"}
            </Button>
          )}
        </AlertDialogFooter>
      </form>
    </Form>
  );
};

export const DeleteUser = ({ data }: any) => {
  const { mutation } = useDeleteUser();
  console.log(data);
  return (
    <div>
      <div className='flex mb-10 justify-between items-center'>
        <h6>Delete User</h6>
        <AlertDialogCancel>
          <XCircle />
        </AlertDialogCancel>
      </div>

      <p>By choosing delete, your user will be permanently deleted from the platform.</p>
      <AlertDialogFooter>
        <Button
          variant={"destructive"}
          onClick={() =>
            mutation.mutate({
              userId: data?._id,
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

export const countries = [
  { name: "Nigeria", flag: "https://flagcdn.com/w320/ng.png" },
  { name: "Ghana", flag: "https://flagcdn.com/w320/gh.png" },
  { name: "South Africa", flag: "https://flagcdn.com/w320/za.png" },
  {
    name: "United Kingdom",

    flag: "https://flagcdn.com/w320/gb.png",
  },
  {
    name: "United States",

    flag: "https://flagcdn.com/w320/us.png",
  },
  { name: "Canada", flag: "https://flagcdn.com/w320/ca.png" },
  { name: "Australia", flag: "https://flagcdn.com/w320/au.png" },
  { name: "Ireland", flag: "https://flagcdn.com/w320/ie.png" },
] as const;
