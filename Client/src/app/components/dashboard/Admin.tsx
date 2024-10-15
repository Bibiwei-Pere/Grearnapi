"use client";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/charts";
import Up from "../assets/images/dashboard/trend-up.svg";
import React from "react";
import Image from "next/image";
import { ReviewsCardBlack } from "./ReviewsCard";
import { useGetUser } from "@/hooks/users";

const Admin = () => {
  const user = useGetUser();

  const platformChartData = {
    title: "User Acquisition Trends - 2023",
    data: [],
  };
  const financialChartData = {
    title: "Monthly Sales Trends - 2023",
    data: [],
  };
  const platform = [
    {
      amount: 0,
      title: "Total revenue generated",
    },
    {
      amount: 0,
      title: "Total number of users (students, teachers)",
    },
    {
      amount: 0,
      title: "Number of active users (in the last 30 days)",
    },
  ];

  const financial = [
    {
      amount: 0,
      title: "Life Time Investment Sales",
    },
    {
      amount: 0,
      title: "Pending affiliate payouts",
    },
    {
      amount: 0,
      title: "Total completed transactions (purchases and payouts)",
    },
  ];

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-3'>
        <h4>Platform Overview</h4>

        <div className='grid gap-3 md:grid-cols-[1fr,378px]'>
          <UsersChart data={platformChartData} />
          <div className='flex flex-col gap-3'>
            {platform.map((item) => (
              <div className='p-6 flex items-center gap-4 bg-white rounded-lg h-full'>
                <Image src={Up} alt='Up' className='w-[48px] h-[48px] border' />
                <span className='flex flex-col gap-2'>
                  <h4 className='text-black'>{item.amount}</h4>
                  <p className='text-[#334155]'>{item.title}</p>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        <h4>Financial Overview</h4>

        <div className='grid gap-3 md:grid-cols-[378px,1fr]'>
          <div className='flex flex-col gap-3'>
            {financial.map((item) => (
              <div className='p-6 flex items-center gap-4 bg-white rounded-lg h-full'>
                <Image src={Up} alt='Up' className='w-[48px] h-[48px] border' />
                <span className='flex flex-col gap-2'>
                  <h4 className='text-black'>{item.amount}</h4>
                  <p className='text-[#334155]'>{item.title}</p>
                </span>
              </div>
            ))}
          </div>
          <UsersChart data={financialChartData} />
        </div>
      </div>
      <UsersStats />
    </div>
  );
};

export default Admin;

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(173 58% 39%)",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(12 76% 61%)",
  },
} satisfies ChartConfig;

const UsersChart = ({ data }: any) => {
  return (
    <div className='bg-white hidden md:block rounded-lg p-10'>
      <h4 className='text-black'>{data.title}</h4>
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='month'
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id='fillDesktop' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='var(--color-desktop)' stopOpacity={0.8} />
              <stop offset='95%' stopColor='var(--color-desktop)' stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id='fillMobile' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='var(--color-mobile)' stopOpacity={0.8} />
              <stop offset='95%' stopColor='var(--color-mobile)' stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey='mobile'
            type='natural'
            fill='url(#fillMobile)'
            fillOpacity={0.4}
            stroke='var(--color-mobile)'
            stackId='a'
          />
          <Area
            dataKey='desktop'
            type='natural'
            fill='url(#fillDesktop)'
            fillOpacity={0.4}
            stroke='var(--color-desktop)'
            stackId='a'
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export const UsersStats = () => {
  const user = useGetUser();

  const statistics = [
    {
      title: "Total Users",
      count: 0,
      percentage: 0,
    },
    {
      title: "Active Users",
      count: 1,
      percentage: 0,
    },
    {
      title: "Inactive Users",
      count: 1,
      percentage: 0,
    },
    {
      title: "Active Investments",
      count: 0,
      percentage: 0,
    },
    {
      title: "User Enrollement Rate",
      count: 0,
      percentage: 0,
    },
    {
      title: "User Chun Rate",
      count: 0,
      percentage: 0,
    },
  ];

  return (
    <div className='grid grid-cols-2 lg:grid-cols-3 max-w-full gap-4'>
      {statistics.map((item) => (
        <ReviewsCardBlack user={item} />
      ))}
    </div>
  );
};
