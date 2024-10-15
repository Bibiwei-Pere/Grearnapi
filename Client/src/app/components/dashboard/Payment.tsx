"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formSchemaPayment } from "../schema/Forms";
import { ContainerDashboard } from "@/components/ui/containers";
import { Check, ChevronDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useGetUser, useUpdateUser } from "@/hooks/users";

export const PaymentSetup = () => {
  const form = useForm<z.infer<typeof formSchemaPayment>>({
    resolver: zodResolver(formSchemaPayment),
  });

  const { mutation } = useUpdateUser();
  const { data: user } = useGetUser();

  const onSubmit = (values: z.infer<typeof formSchemaPayment>) => {
    const bankDetails = {
      bankName: values.bankName,
      accountName: values.accountName,
      accountNumber: values.accountNumber,
    };

    mutation.mutate({
      userId: user?._id,
      bankDetails,
    });
  };

  return (
    <ContainerDashboard>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4 py-5 max-w-[600px] mx-auto w-full'>
          <h6>Your Bank Information</h6>

          <FormField
            control={form.control}
            name='accountName'
            render={({ field }) => (
              <FormItem>
                <Label>Account Name</Label>
                <Input placeholder='Enter name' {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='accountNumber'
            render={({ field }) => (
              <FormItem>
                <Label>Account Number</Label>
                <Input placeholder='Enter number' {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='bankName'
            render={({ field }) => (
              <FormItem>
                <Label>Bank name</Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='secondary'
                      role='combobox'
                      size={"sm"}
                      className='rounded-md h-10 py-0 px-3 justify-between ml-0 border-gray-800 w-full hover:text-white hover:bg-black'
                    >
                      {field.value ? field.value : "Select Bank Name"}
                      <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0'>
                    <Command>
                      <CommandInput placeholder='Search categories...' />
                      <CommandList>
                        <CommandEmpty>No bank found.</CommandEmpty>
                        <CommandGroup>
                          {nigerianBanks.map((bank: string) => (
                            <CommandItem
                              value={bank}
                              key={bank}
                              onSelect={() => {
                                form.setValue("bankName", bank);
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", bank === field.value ? "opacity-100" : "opacity-0")}
                              />

                              {bank}
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

          <Button variant={"ghost"}>Save</Button>
        </form>
      </Form>
    </ContainerDashboard>
  );
};

const nigerianBanks = [
  "Access Bank Plc",
  "Citibank Nigeria Limited",
  "Ecobank Nigeria",
  "Fidelity Bank Plc",
  "First Bank of Nigeria Limited",
  "First City Monument Bank (FCMB)",
  "Globus Bank Limited",
  "Guaranty Trust Bank Plc",
  "Heritage Bank Plc",
  "Jaiz Bank Plc",
  "Keystone Bank Limited",
  "Parallex Bank Limited",
  "Polaris Bank Limited",
  "Providus Bank Limited",
  "Stanbic IBTC Bank Plc",
  "Standard Chartered Bank Nigeria",
  "Sterling Bank Plc",
  "SunTrust Bank Nigeria Limited",
  "Titan Trust Bank Limited",
  "Union Bank of Nigeria Plc",
  "United Bank for Africa (UBA) Plc",
  "Unity Bank Plc",
  "Wema Bank Plc",
  "Zenith Bank Plc",
];
