"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { SkeletonCard2 } from "@/components/ui/skeleton";
import { ContainerDashboard } from "@/components/ui/containers";
import Image from "next/image";
import RecentActivity from "../components/dashboard/RecentActivity";
import { useGetUser } from "@/hooks/users";
import { useRouter } from "next/navigation";
import Admin from "../components/dashboard/Admin";

const Dashboard = () => {
  const { data: user, status } = useGetUser();
  const navigation = useRouter();
  if (status !== "success") return <SkeletonCard2 />;
  else
    return (
      <ContainerDashboard>
        <div className='flex flex-col sm:flex-row justify-between'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <Image
                onClick={() => navigation.push("/dashboard/profile")}
                src={user?.avatar?.url || "/noavatar.png"}
                alt='Avatar'
                width={100}
                height={100}
                className='rounded-full w-20 h-20 cursor-pointer'
              />
              <h4>Hello {user?.username}</h4>
            </div>
            <p>Let’s learn something new today!</p>
            <h2>Dashboard</h2>
          </div>
          <div className='flex items-start flex-col gap-3 justify-end '>
            <Button
              onClick={() => navigation.push("/dashboard/admin/users")}
              className='mr-0 md:ml-0 md:w-full'
              variant={"ghost"}
            >
              Manage users
            </Button>
            <Button onClick={() => navigation.push("/dashboard/admin/courses")} className='mr-0' variant={"ghost"}>
              Manage courses
            </Button>
          </div>
        </div>
        <Admin />
      </ContainerDashboard>
    );
};

export default Dashboard;
