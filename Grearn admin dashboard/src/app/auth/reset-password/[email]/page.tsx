"use client";
import Link from "next/link";
import React from "react";
import { resetPasswordProp } from "@/app/components/schema/Types";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ContainerAuth } from "@/components/ui/containers";
import { WrapperAuth } from "@/components/ui/wrappers";

const ResetPassword = ({ params }: resetPasswordProp) => {
  const { email } = params;
  const navigation = useRouter();

  return (
    <ContainerAuth>
      <WrapperAuth>
        <p
          onClick={() => navigation.back()}
          className="flex gap-3 mb-4 hover:text-white text-center mx-auto"
        >
          <ArrowLeft className="w-6" />
          Back to log in
        </p>
        <h1>Check you email</h1>
        <p className="text-center">
          We sent a password reset link to{" "}
          <b className="text-white">{decodeURIComponent(email)}</b>
        </p>
        <Link href="https://mail.google.com/mail/u/0/">
          <Button variant={"ghost"} className="w-full mt-5 mb-3" type="submit">
            Open email app
          </Button>
        </Link>
        <h6 className="mx-auto">
          Didn’t receive the email?{" "}
          <span onClick={() => navigation.back()} className="underline">
            Resend
          </span>
        </h6>
      </WrapperAuth>
    </ContainerAuth>
  );
};

export default ResetPassword;
