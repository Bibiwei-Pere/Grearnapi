import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../auth/useAxiosAuth";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp } from "@/app/components/schema/Types";

const queryKey = "/video";

export function useGetVideo(courseId: string) {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/video/${courseId}`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetAllVideo() {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/video`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export const useCreateVideo = () => {
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post("/video", data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
    },
    onSuccess: (response) => {
      console.log("success", response);
    },
  });

  return { mutation };
};

export const useDeleteVideo = () => {
  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.delete("/video", data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
    },
    onSuccess: (response) => {
      console.log("success", response);
    },
  });

  return { mutation };
};

export const useEditVideo = () => {
  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.patch("/video", data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
    },
    onSuccess: (response) => {
      console.log("success", response);
    },
  });

  return { mutation };
};
