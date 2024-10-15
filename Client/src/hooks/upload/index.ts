import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../auth/useAxiosAuth";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp } from "@/app/components/schema/Types";
import { waitForThreeSeconds } from "../auth";
import { useToast } from "@/components/ui/use-toast";

export function useGetUpload(fileName: string) {
  const queryClient = useQueryClient();
  const queryKey = `/upload/${fileName}`;
  const axiosAuth = useAxiosAuth();

  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      try {
        const res = await axiosAuth.get(`/upload/${fileName}`);
        return res?.data?.signedUrl; // Return only the signed URL
      } catch (error) {
        console.error("Error fetching signed URL:", error);
        throw error; // Let it retry based on retry settings
      }
    },
    retry: 3, // Retry fetching if failed (e.g., due to expiration)
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export const useDeleteUpload = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.delete(`/upload`, { data });
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data);
      toast({
        variant: "destructive",
        title: "An error occured!.",
        description: error.response.data.error,
      });
    },
    onSuccess: async (response) => {
      console.log("success", response);
      toast({
        variant: "success",
        title: "Successful!.",
        description: "File as been deleted",
      });
    },
  });

  return { mutation };
};

export const usePostUpload = () => {
  const [response, setResponse] = useState<any>({});
  const [progress, setProgress] = useState(0); // Track progress
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post("/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 1200000,
        onUploadProgress: (progressEvent: any) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentage); // Update progress
        },
      });
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "An error occured!.",
        description: "Please try again",
      });
      setResponse(error?.response?.data?.message);
    },
    onSuccess: (response) => {
      console.log("Success:", response.data);
      toast({
        variant: "success",
        title: "Successful!.",
        description: "File upload successful",
      });
      setResponse(response.data.data);
      setProgress(100); // Set progress to 100% after successful upload
    },
  });

  // Reset progress when file is uploaded or mutation is reset
  useEffect(() => {
    if (mutation.isSuccess) {
      setProgress(0); // Reset progress after upload
    }
  }, [mutation.isSuccess]);

  return { mutation, response, progress };
};
