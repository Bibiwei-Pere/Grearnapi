"use client";
import React from "react";
import Link from "next/link";
import Logo from "../assets/image/Grearn.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronsLeftRight, LucideHeadphones, AlignLeft, Settings, Radio } from "lucide-react";
import { FaChartGantt, FaGauge, FaNetworkWired, FaUsers } from "react-icons/fa6";
import { useSession } from "next-auth/react";

const Sidebar = ({ mobile, setMobile }: { mobile: boolean; setMobile: any }) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  React.useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(max-width: 1068px)").matches) setMobile(true);
      else setMobile(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`py-7 fixed top-0 bottom-0 overflow-auto z-10 transition-all duration-300 ${
        mobile ? "w-0 sm:w-[65px] bg-white" : "bg-black w-[310px] px-5"
      }`}
    >
      <div
        className={`flex relative flex-col overflow-auto gap-6 pt-4 pb-14 top-0 bottom-0 z-50 ${
          mobile ? "items-center" : "px-3"
        }`}
      >
        {/* Icon to toggle sidebar */}
        {!mobile && (
          <ChevronsLeftRight
            className='absolute hover:text-[#7fff0f] cursor-pointer top-5 right-0'
            onClick={() => setMobile(!mobile)}
          />
        )}
        {mobile ? (
          <AlignLeft
            onClick={() => setMobile(!mobile)}
            className='w-[30px] h-[30px] cursor-pointer text-gray-400 hover:text-[#7fff0f]'
          />
        ) : (
          <div className='flex gap-2 items-center max-w-[100px] relative'>
            <Image src={Logo} alt='Logo' className='absolute right-0 w-[50px]' />
            <h6 className='text-[#7fff0f]'>GREARN</h6>
          </div>
        )}

        <ul className={`flex flex-col gap-9 py-10 mt-5 ${!mobile && "border-t-2 border-gray-800"}`}>
          {sidebarContent.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={`group flex gap-2 items-center hover:text-[#7fff0f] hover:font-medium ${
                pathname === item.url && "text-[#7fff0f] hover:text-white"
              }`}
            >
              <item.icon
                className={`w-[25px] h-[25px] ${
                  mobile ? "text-black hover:text-[#7fff0f] " : pathname === item.url && "text-[#7fff0f]"
                }`}
              />
              {/* Show title when sidebar is expanded */}
              <h6 className={`${mobile && "hidden"} transition-all duration-300`}>{item.title}</h6>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

export const sidebarContent = [
  {
    icon: FaGauge,
    url: "/dashboard",
    title: "Dashboard",
  },
  {
    icon: FaUsers,
    url: "/dashboard/users",
    title: "Users",
  },
  {
    icon: FaChartGantt,
    url: "/dashboard/investment",
    title: "Investments",
  },
  {
    icon: FaNetworkWired,
    url: "/dashboard/affiliate",
    title: "Affiliate Program",
  },
  {
    icon: Settings,
    url: "/dashboard/settings/Profile",
    title: "Settings",
  },
  {
    icon: LucideHeadphones,
    url: "/dashboard/support",
    title: "Support",
  },
  {
    icon: Radio,
    url: "/dashboard/signal",
    title: "Signals",
  },
];
