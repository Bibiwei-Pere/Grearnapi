import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Notifications from "@/app/components/dashboard/Notifications";
// import Email from "@/app/components/dashboard/Email";
import Password from "@/app/components/dashboard/Password";
import Profile from "@/app/components/dashboard/Profile";
import { ContainerDashboard } from "@/components/ui/containers";
import { PaymentSetup } from "@/app/components/dashboard/Payment";

const Settings = ({ params }: any) => {
  const { tab } = params;
  return (
    <ContainerDashboard>
      <h1 className='text-left mb-2'>Settings</h1>
      <Tabs defaultValue={tab} className='w-full mt-4'>
        <TabsList>
          {settings.map((setting) => (
            <TabsTrigger value={setting.value} key={setting.value}>
              {setting.value}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className='border-b border-gray-800'></div>
        <div className='max-w-full'>
          {settings.map((setting) => (
            <TabsContent value={setting.value} key={setting.value} className='max-w-full mx-auto my-2 pb-20 navItems'>
              {setting.component}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </ContainerDashboard>
  );
};

const settings = [
  {
    value: "Profile",
    component: <Profile />,
  },
  {
    value: "Payment",
    component: <PaymentSetup />,
  },
  {
    value: "Password",
    component: <Password />,
  },
  // {
  //   value: "Email",
  //   component: <Email />,
  // },
  {
    value: "Notifications",
    component: <Notifications />,
  },
];

export default Settings;
