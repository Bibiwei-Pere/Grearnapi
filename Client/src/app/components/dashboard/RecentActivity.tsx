import React from "react";
import Certificates from "../assets/images/dashboard/Certificates.svg";
import Withdrawals from "../assets/images/dashboard/Affiliates.svg";
import empty from "../assets/images/dashboard/empty.svg";
import Image from "next/image";
import { formatDateShort } from "@/hooks/auth";

const RecentActivity = ({ data }: { data: any }) => {
  console.log(data);
  return (
    <div className='bg-white px-6 max-w-full h-[405px] overflow-y-auto'>
      <h6 className='sticky top-0 bg-white py-4 w-full h-10'></h6>

      {data ? (
        data.map((item: any) => (
          <div className='flex py-[5px] gap-6 items-center'>
            {item?.transactionType === "Paystack" ? (
              <Image src={Withdrawals} alt='Withdrawals' width={100} height={100} className='w-[40px] h-auto' />
            ) : item.title === "Withdrawals" ? (
              <Image src={Certificates} alt='Certificates' width={100} height={100} className='w-[40px] h-auto' />
            ) : (
              <Image src={Withdrawals} alt='Withdrawals' width={100} height={100} className='w-[40px] h-auto' />
            )}
            {item.transactionType === "Paystack" && item.product !== "Withdrawal" && item.completed === true ? (
              <h5 className='w-[148px] text-[#666666]'>Succesful Course purchase </h5>
            ) : item.transactionType === "Paystack" && item.product !== "Withdrawal" && item.completed === false ? (
              <h5 className='w-[148px] text-[#666666]'>Failed Course purchase </h5>
            ) : item.title === "Les" ? (
              <h5 className='w-[148px] text-[#666666]'>Completed Lesson</h5>
            ) : item.title === "Withdrawals" ? (
              <h5 className='w-[148px] text-[#666666]'>Withdrew Affiliate Earnings</h5>
            ) : (
              <h5 className='w-[148px] text-[#666666]'>{item.transactionType}</h5>
            )}
            <p className='ml-7 text-[#666666]'>{formatDateShort(item.createdAt)}</p>
            <p className='ml-7 text-[#666666]'>{item.category}</p>
            <p className='ml-7 text-[#666666]'>{item.completed ? "Successful" : "Failed"}</p>
          </div>
        ))
      ) : (
        <div className='flex flex-col items-center justify-center w-full h-[200px] gap-4'>
          <Image src={empty} alt='empty' width={100} height={100} className='w-[100px] h-auto' />
          <p className='text-[#666666] text-center'>No transactions yet</p>
        </div>
      )}
      <h6 className='sticky bottom-0 bg-white py-4 w-full h-10'></h6>
    </div>
  );
};

export default RecentActivity;
