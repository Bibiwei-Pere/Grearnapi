"use client";
import Image from "next/image";
import Link from "next/link";
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
import { loginSchema } from "@/app/components/schema/Forms";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp, authProp } from "@/app/components/schema/Types";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  ErrorModal,
  SuccessModal,
} from "@/components/ui/alert-dialog";
import { login } from "@/actions/login";
import { useRouter } from "next/navigation";
import { ContainerAuth } from "@/components/ui/containers";
import { WrapperAuth } from "@/components/ui/wrappers";

const Login = () => {
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [response, setResponse] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useRouter();

  const mutation = useMutation({
    mutationFn: (data: authProp) => {
      return axiosInstance.post(`/auth/signin`, data);
    },
    onError: (error: ErrorProp) => {
      setErrorModal(true);
      setResponse(error.response.data.message);
      console.log("ERROR", error.response.data.message);
    },
    onSuccess: (response) => {
      login({
        email: email,
        password: password,
      });

      setSuccessModal(true);
      setResponse("Welcome to Candlepaths! Proceed to dashboard");
      console.log("success", response.data);
    },
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setEmail(values.email);
    setPassword(values.password);
    mutation.mutate(values);
  };

  return (
    <ContainerAuth>
      <WrapperAuth>
        <div className="flex">
          <Button
            onClick={() => navigation.push("signup")}
            variant={"secondary"}
            className="bg-[#FFFFFF0D] w-full rounded-e-none"
          >
            Create account
          </Button>
          <Button
            onClick={() => navigation.push("login")}
            variant={"ghost"}
            className="bg-[#FFFFFF26] w-full rounded-s-none"
          >
            Log In
          </Button>
        </div>
        <h1>Welcome back</h1>
        <p className="text-center">Login to your account</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
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
            <Link href="reset-password">Fogot Password?</Link>
            <Button
              variant={"ghost"}
              className="w-full mt-5 mb-3"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Log In"
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
            </div>{" "}
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
            <AlertDialogAction onClick={() => navigation.push("/dashboard")}>
              Continue
            </AlertDialogAction>
          </SuccessModal>
        </AlertDialog>
      )}
    </ContainerAuth>
  );
};

export default Login;
