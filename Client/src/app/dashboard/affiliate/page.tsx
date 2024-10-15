"use client";
import { Button } from "@/components/ui/button";
import { ContainerDashboard, DashboardHeader } from "@/components/ui/containers";
import React from "react";
import { Copy, MousePointerClick, Users } from "lucide-react";
import { useGetUser } from "@/hooks/users";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/charts";
import { Area, AreaChart, XAxis, Bar, BarChart } from "recharts";
import { FaInbox } from "react-icons/fa6";

const Affiliate = () => {
  const user = useGetUser();
  console.log(user);

  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyClick = () => {
    console.log("first");
    navigator.clipboard
      .writeText(`https://Grearns.com/auth/signup/${user?.data?.username}`)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Failed to copy: ", error);
      });
  };

  const affiliateStats = [
    {
      title: "Current balance",
      amount: user?.data?.affiliate?.balance,
    },
    {
      title: "Lifetime earnings",
      amount: user?.data?.affiliate?.lifetimeEarnings,
    },
    {
      title: "Total withdrawn",
      amount: user?.data?.affiliate?.withdrawalCount,
    },
  ];

  const withdrawalStats = [
    {
      title: "Withdrawal Status",
      amount: user?.data?.affiliate?.balance,
    },
    {
      title: "Commission Rate Overview",
      amount: user?.data?.affiliate?.lifetimeEarnings,
    },
    {
      title: "Next Payment Date",
      amount: user?.data?.affiliate?.withdrawalCount,
    },
  ];

  const performanceStats = [
    {
      icon: MousePointerClick,
      title: "Clicks",
      amount: user?.data?.affiliate?.balance,
    },
    {
      icon: FaInbox,
      title: "Conversions",
      amount: user?.data?.affiliate?.lifetimeEarnings,
    },
    {
      icon: Users,
      title: "Conversion rate",
      amount: user?.data?.affiliate?.withdrawalCount,
    },
  ];

  return (
    <ContainerDashboard className='bg-black pb-20'>
      <DashboardHeader>
        <h2>Affiliate Program</h2>
      </DashboardHeader>
      <div className='flex flex-col gap-10 p-4'>
        <div className='flex flex-col gap-4'>
          <h4>Referral Link</h4>
          <div className='flex gap-3 items-center'>
            <div className='w-full py-2 px-3 flex gap-5 justify-between items-center rounded-lg bg-[#2A3142]'>
              <h3>https://Grearns.com/auth/signup/{user?.data?.username}</h3>
              <Button variant='ghost' className='mr-0' onClick={handleCopyClick}>
                {isCopied ? (
                  "Copied"
                ) : (
                  <div className='flex gap-2'>
                    Copy Link
                    <Copy className='h-5 w-5' />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <h4>Earnings</h4>
          <span className='grid md:grid-cols-3 gap-3'>
            {affiliateStats.map((item: any) => (
              <div className='flex flex-col gap-4 border border-gray-800 rounded-lg p-5'>
                <p>{item.title}</p>
                <h4 className='text-[24px]'>₦{item?.amount || 0}</h4>
              </div>
            ))}
          </span>
        </div>

        <div className='flex flex-col gap-2'>
          <span className='grid md:grid-cols-3 gap-3'>
            {withdrawalStats.map((item: any) => (
              <div>
                <p className='mb-3'>{item.title}</p>
                <div className='flex flex-col gap-4 border h-[100px] justify-center border-gray-800 rounded-lg p-5'>
                  <h4 className='text-[24px]'>{item?.amount || 0}</h4>
                </div>
              </div>
            ))}
          </span>
        </div>

        <div className='flex flex-col gap-2'>
          <span className='hidden md:grid md:grid-cols-2 gap-3'>
            <AffiliateChart />
            <AffiliateBarChart />
          </span>
        </div>

        <div className='flex flex-col gap-4'>
          <h4>Performance</h4>
          <span className='grid md:grid-cols-3 gap-3'>
            {performanceStats.map((item: any) => (
              <div className='flex flex-col gap-2 border border-gray-800 rounded-lg p-5'>
                <item.icon />
                <h6>{item.title}</h6>
                <p>{item?.amount || "--"}</p>
              </div>
            ))}
          </span>
        </div>
      </div>
    </ContainerDashboard>
  );
};

export default Affiliate;

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
    color: "hsl(197 37% 24%)",
  },
} satisfies ChartConfig;

const chartData2 = [
  { date: "2024-07-15", running: 450, swimming: 300 },
  { date: "2024-07-16", running: 380, swimming: 420 },
  { date: "2024-07-17", running: 520, swimming: 120 },
  { date: "2024-07-18", running: 140, swimming: 550 },
  { date: "2024-07-19", running: 600, swimming: 350 },
  { date: "2024-07-20", running: 480, swimming: 400 },
];

const AffiliateChart = ({ data }: any) => {
  return (
    <div className='bg-transparent md:block rounded-lg p-10'>
      <h4 className='text-black'>Earnings (NGN)</h4>

      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
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

const AffiliateBarChart = ({ data }: any) => {
  return (
    <div className='bg-transparent md:block rounded-lg p-10'>
      <h4 className='text-black'>Earnings (NGN)</h4>

      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData2}>
          <XAxis
            dataKey='date'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => {
              return new Date(value).toLocaleDateString("en-US", {
                weekday: "short",
              });
            }}
          />
          <Bar dataKey='running' stackId='a' fill='var(--color-desktop)' radius={[0, 0, 4, 4]} />
          <Bar dataKey='swimming' stackId='a' fill='var(--color-mobile)' radius={[4, 4, 0, 0]} />
          {/* <ChartTooltip content={<ChartTooltipContent indicator='line' />} cursor={false} defaultIndex={1} /> */}
        </BarChart>
      </ChartContainer>
    </div>
  );
};
