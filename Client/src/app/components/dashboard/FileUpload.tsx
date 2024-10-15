"use client";
import { usePostUpload } from "@/hooks/upload";
import React from "react";
import { CloudUpload, Loader2 } from "lucide-react";

export const FileUploadSingle = ({ onUploadSuccess }: any) => {
  const { mutation } = usePostUpload(); // Use mutation hook

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Start upload and track progress
    mutation.mutate(formData, {
      onSuccess: (response: any) => {
        onUploadSuccess(response.data.data); // Pass the response back to parent
      },
    });
  };

  return (
    <div className='w-full flex gap-[25px] h-full justify-between mt-3'>
      <div className='w-full relative border-2 border-gray-800 border-solid rounded-lg p-6 fileUpload'>
        <input
          type='file'
          name='image'
          className='absolute inset-0 w-full h-full opacity-0 z-50'
          accept='image/png, image/jpeg, image/gif'
          onChange={handleFileChange}
        />
        {mutation.isPending ? (
          <div className='text-center flex flex-col justify-center items-center w-full'>
            <Loader2 className='animate-spin' />
          </div>
        ) : (
          <div className='text-center flex flex-col justify-center items-center w-full'>
            <CloudUpload className='h-[37px] w-[37px]' />
            <h4 className='mt-2 text-sm font-medium text-gray-900'>
              <label htmlFor='file-upload' className='relative cursor-pointer'>
                <span className='flex justify-center'>
                  <p className='text-yellow-500'>Click to upload</p>
                  <p className='pl-[5px]'> or drag and drop</p>
                </span>
                <input
                  id='file-upload'
                  name='file-upload'
                  type='file'
                  className='sr-only'
                  accept='image/png, image/jpeg, image/gif'
                  onChange={handleFileChange}
                />
              </label>
            </h4>
            <p className='mt-2 text-xs text-gray-500'>SVG, PNG, JPG, or GIF (max. 800x400px)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const getFormattedDate = (date: any) => {
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  return `${month}-${year}`;
};
