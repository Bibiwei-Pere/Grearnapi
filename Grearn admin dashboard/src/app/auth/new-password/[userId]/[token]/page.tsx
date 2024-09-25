"use client";
import React, { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPasswordSchema } from "@/app/components/schema/Forms";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import {
  authProp,
  ErrorProp,
  newPasswordProp,
} from "@/app/components/schema/Types";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  ErrorModal,
  SuccessModal,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { ContainerAuth } from "@/components/ui/containers";
import { WrapperAuth } from "@/components/ui/wrappers";

const NewPassword = ({ params }: newPasswordProp) => {
  const { userId, token } = params;
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [response, setResponse] = useState("");
  const navigation = useRouter();

  const mutation = useMutation({
    mutationFn: (data: authProp) => {
      return axiosInstance.post(`/auth/new-password/${userId}/${token}`, data);
    },
    onError: (error: ErrorProp) => {
      setErrorModal(true);
      setResponse(error.response.data.message);
      console.log("ERROR", error.response.data.message);
    },
    onSuccess: (response) => {
      setSuccessModal(true);
      setResponse("Password reset successful, proceed to login");
      console.log("success", response.data);
    },
  });

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
  });

  const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    mutation.mutate(values);
  };

  return (
    <ContainerAuth>
      <WrapperAuth>
        <p
          onClick={() => navigation.push("/auth/login")}
          className="flex mx-auto gap-3 mb-4 hover:text-white text-center"
        >
          <ArrowLeft className="w-6" />
          Back to log in
        </p>
        <h1>Set new password</h1>
        <p className="text-center">
          Your new password must be different to previously used passwords.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Password must be 6 characters"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Password must be 6 characters"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant={"ghost"}
              className="w-full mt-5 mb-3"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Reset password"
              )}
            </Button>
          </form>
        </Form>
      </WrapperAuth>
      {errorModal && (
        <AlertDialog open onOpenChange={(open) => setErrorModal(open)}>
          <ErrorModal description={response}>
            <AlertDialogAction>Close</AlertDialogAction>
          </ErrorModal>
        </AlertDialog>
      )}
      {successModal && (
        <AlertDialog open onOpenChange={(open) => setErrorModal(open)}>
          <SuccessModal description={response}>
            <AlertDialogAction onClick={() => navigation.push("/auth/login")}>
              Continue
            </AlertDialogAction>
          </SuccessModal>
        </AlertDialog>
      )}
    </ContainerAuth>
  );
};

export default NewPassword;
