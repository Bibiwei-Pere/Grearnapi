"use client";
import Image from "next/image";
import React, { useState } from "react";
import Apple from "../../components/assets/images/auth/apple.svg";
import Facebook from "../../components/assets/images/auth/facebook.svg";
import Google from "../../components/assets/images/auth/google.svg";
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
import { signupSchema } from "@/app/components/schema/Forms";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp, SigupProp } from "@/app/components/schema/Types";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

const Signup = () => {
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [response, setResponse] = useState("");
  const navigation = useRouter();

  const mutation = useMutation({
    mutationFn: (data: SigupProp) => {
      return axiosInstance.post(`/auth/signup`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
      setErrorModal(true);
      setResponse(error.response.data.message);
    },
    onSuccess: (response) => {
      setSuccessModal(true);
      setResponse(response.data.message);

      console.log("success", response);
    },
  });

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (values: z.infer<typeof signupSchema>) =>
    mutation.mutate(values);

  return (
    <ContainerAuth>
      <WrapperAuth>
        <div className="flex">
          <Button
            onClick={() => navigation.push("signup")}
            variant={"ghost"}
            className="bg-[#FFFFFF26] w-full rounded-e-none"
          >
            Create account
          </Button>
          <Button
            onClick={() => navigation.push("login")}
            variant={"secondary"}
            className="bg-[#FFFFFF0D] w-full rounded-s-none"
          >
            Log In
          </Button>
        </div>
        <h1>Sign up To Get Started</h1>
        <p className="text-center">
          Create an account to get started on candlepath
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>

                  <Input
                    type="text"
                    placeholder="Enter your username"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>

                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Password must be atleast 6 characters"
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
                    placeholder="Password must be atleast 6 characters"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Checkbox />
              <FormLabel className="bottom-0">
                I agree to the Terms Of Service and Privacy Policy
              </FormLabel>
            </div>
            <Button
              variant={"ghost"}
              className="w-full mt-5 mb-3"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="max-w-[414px] w-full mx-auto grid items-center gap-8 grid-cols-[1fr_10px_1fr]">
              <span className="bg-white h-px"></span>
              <h6>Or</h6>
              <span className="bg-white h-px"></span>
            </div>

            <div className="max-w-[414px] flex justify-between mx-auto w-full gap-2">
              <Button className="w-full" variant={"ghost"}>
                <Image src={Google} alt="Envelope" />
              </Button>
              <Button className="w-full" variant={"ghost"}>
                <Image src={Apple} alt="Envelope" />
              </Button>
              <Button className="w-full" variant={"ghost"}>
                <Image src={Facebook} alt="Envelope" />
              </Button>
            </div>
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
        <AlertDialog open onOpenChange={(open) => setSuccessModal(open)}>
          <SuccessModal description={response}>
            <AlertDialogAction onClick={() => navigation.push("login")}>
              Continue
            </AlertDialogAction>
          </SuccessModal>
        </AlertDialog>
      )}
    </ContainerAuth>
  );
};

export default Signup;
