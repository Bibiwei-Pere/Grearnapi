import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import axiosInstance from "@/lib/axios-instance";
import { authProp, ErrorProp } from "@/app/components/schema/Types";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";

export const useSignup = () => {
  const [response, setResponse] = useState("");
  const { toast } = useToast();
  const [data, setData] = useState<authProp>({});
  const mutation = useMutation({
    mutationFn: (data: authProp) => {
      setData(data);
      return axiosInstance.post(`/auth/signup/`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
      setResponse(error.response.data.message);
    },
    onSuccess: async () => {
      if (data.email && data.password) {
        await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });
      }
      toast({
        variant: "success",
        title: "Successful!.",
        description: "Welcome to Grearns",
      });
      await waitForThreeSeconds();

      window.location.href = "/dashboard";
    },
  });

  return { mutation, response };
};

export const useSignupRefferal = (username: string) => {
  const [response, setResponse] = useState("");
  const { toast } = useToast();
  const [data, setData] = useState<authProp>({});

  const mutation = useMutation({
    mutationFn: (data: authProp) => {
      setData(data);
      return axiosInstance.post(`/auth/signup/${username}`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
      setResponse(error.response.data.message);
    },
    onSuccess: async () => {
      if (data.email && data.password) {
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
      }
      toast({
        variant: "success",
        title: "Successful!.",
        description: "Welcome to Grearns",
      });
      await waitForThreeSeconds();

      window.location.href = "/dashboard";
    },
  });

  return { mutation, response };
};

export const useLogin = () => {
  const [response, setResponse] = useState("");
  const { toast } = useToast();
  const [data, setData] = useState<authProp>({});

  const mutation = useMutation({
    mutationFn: (data: authProp) => {
      setData(data);
      return axiosInstance.post(`/auth/login`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
      setResponse(error.response.data.message);
    },
    onSuccess: async () => {
      if (data.email && data.password) {
        await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });
      }
      toast({
        variant: "success",
        title: "Successful!.",
        description: "Welcome to Grearns",
      });
      await waitForThreeSeconds();

      window.location.href = "/dashboard";
    },
  });

  return { mutation, response };
};

export const waitForThreeSeconds = () => new Promise((resolve) => setTimeout(resolve, 3000));

export function formatDate(dateString: any) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const suffix = (day: any) => {
    if (day > 3 && day < 21) return "th"; // covers 4-20
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${suffix(day)} ${month} ${year}`;
}

export function formatDateShort(dateString: any) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const suffix = (day: any) => {
    if (day > 3 && day < 21) return "th"; // covers 4-20
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${suffix(day)} ${month} ${year}`;
}

export const shortenText = (text: string, maxLength: number) => {
  if (text.length > maxLength) return `${text.substring(0, maxLength)}...`;
  return text;
};
