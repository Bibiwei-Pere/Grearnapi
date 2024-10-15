"use client";
import * as React from "react";
import { useGetStatistics } from "@/hooks/users";
import { ReviewsCardBlack } from "./ReviewsCard";

export const UsersStats = () => {
  const { data: statistics } = useGetStatistics();

  const userStats = [
    {
      title: "Total Users",
      count: statistics?.userStats?.totalUsers,
    },
    {
      title: "Active Users",
      count: statistics?.userStats?.activeUsers,
    },
    {
      title: "Inactive Users",
      count: statistics?.userStats?.inactiveUsers,
    },
    {
      title: "Courses Completed",
      percentage: statistics?.userStats?.courseCompleted,
    },
    {
      title: "Users Enrollment Rate",
      percentage: statistics?.userStats?.userEnrollRate,
    },
    {
      title: "Users Churn Rate",
      percentage: statistics?.userStats?.userChunRate,
    },
  ];
  return (
    <div className='grid grid-cols-2 lg:grid-cols-3 max-w-full gap-4'>
      {userStats.map((item: any) => (
        <ReviewsCardBlack user={item} />
      ))}
    </div>
  );
};
