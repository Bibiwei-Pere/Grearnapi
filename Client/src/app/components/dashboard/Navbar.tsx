"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Settings, Bell, User, Radio, AlignLeft } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useGetUser } from "@/hooks/users";
import { useGetNotification } from "@/hooks/notification";
import Link from "next/link";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarContent } from "./Sidebar";
import { AvatarDropdown, NotificationDropdown, SignalDropdown } from "./NavDropdown";
import { useGetUserSignals } from "@/hooks/signal";

const Navbar = () => {
  const pathname = usePathname();
  const navigation = useRouter();
  const user = useGetUser();
  const [unread, setUnread] = useState(0);
  const { data: notifications } = useGetNotification();
  const { data: signals } = useGetUserSignals();

  useEffect(() => {
    if (signals) {
      const unreadSignals = signals.filter((signal: any) => signal.isRead === false);
      setUnread(unreadSignals.length);
    }
  }, [signals]);
  const handleSignalRead = () => {
    setUnread((prev) => (prev > 0 ? prev - 1 : 0)); // Decrease unread count by 1
  };

  return (
    <div
      className={`w-full z-10 px-4 sm:px-0 sm:pr-10 sticky top-0 pb-4 flex items-center gap-16 justify-between sm:justify-end bg-black pt-4 sm:pt-8 border-b-2 border-gray-800`}
    >
      <div className='sm:hidden'>
        <MobileMenu />
      </div>

      <ul className='flex gap-4 items-center'>
        {navbarContent.map((item) => (
          <div key={item.url} onClick={() => navigation.push(`${item.url}`)}>
            {item.title === "Avatar" ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className='relative w-[50px] hover:cursor-pointer h-[50px] rounded-full overflow-hidden'
                >
                  <div>
                    <Image
                      src={user?.data?.avatar?.url || "/noavatar.png"}
                      alt='Avatar'
                      height={150}
                      width={150}
                      className='w-auto h-full'
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <AvatarDropdown />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : item.title === "Notification" ? (
              <DropdownMenu>
                <div className='relative'>
                  {notifications?.length > 0 && (
                    <div className='rounded-full absolute top-[-12px] left-[-2px] w-4 flex items-center justify-center text-[11px] h-4 bg-red-600'>
                      {notifications?.length}
                    </div>
                  )}
                  <DropdownMenuTrigger asChild>
                    <item.icon
                      className={`hover:text-[#7fff0f] hover:font-medium border-b-2 pb-1 ${
                        pathname === item.url
                          ? "text-[#7fff0f] hover:text-white border-[#7fff0f] hover:border-white"
                          : "border-black"
                      }`}
                    />
                  </DropdownMenuTrigger>
                </div>

                <DropdownMenuContent className='relative bg-white px-6 max-w-[500px] max-h-[500] py-0 overflow-y-auto'>
                  <NotificationDropdown data={notifications} />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : item.title === "Signals" ? (
              <DropdownMenu>
                <div className='relative'>
                  {unread > 0 && (
                    <div className='rounded-full absolute top-[-12px] left-[-2px] w-4 flex items-center justify-center text-[11px] h-4 bg-red-600'>
                      {unread}
                    </div>
                  )}
                  <DropdownMenuTrigger asChild>
                    <item.icon
                      className={`hover:text-[#7fff0f] hover:font-medium border-b-2 pb-1 ${
                        pathname === item.url
                          ? "text-[#7fff0f] hover:text-white border-[#7fff0f] hover:border-white"
                          : "border-black"
                      }`}
                    />
                  </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent className='relative bg-white px-6 max-w-[500px] max-h-[500] py-0 overflow-y-auto'>
                  <SignalDropdown data={signals} onSignalRead={handleSignalRead} />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <item.icon
                className={`hover:text-[#7fff0f] hover:font-medium border-b-2 pb-1 ${
                  pathname === item.url
                    ? "text-[#7fff0f] hover:text-white border-[#7fff0f] hover:border-white"
                    : "border-black"
                }`}
              />
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;

const navbarContent = [
  {
    url: "#",
    title: "Signals",
    icon: Radio,
  },
  {
    url: "/dashboard/settings/Profile",
    title: "Settings",
    icon: Settings,
  },
  {
    url: "#",
    title: "Notification",
    icon: Bell,
  },
  {
    url: "#",
    title: "Avatar",
    icon: User,
  },
];

const MobileMenu = () => {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <AlignLeft className='w-[30px] h-[30px] cursor-pointer' />
      </SheetTrigger>
      <SheetContent className='pb-20 bg-yellow-50 overflow-y-scroll'>
        <div className='flex flex-col gap-5 mt-10'>
          {sidebarContent.map((sidebar) => (
            <SheetClose asChild key={sidebar.title}>
              <Link
                href={sidebar.url}
                className={`grid grid-cols-[30px,1fr] gap-1 items-center py-1 rounded-md px-2 hover:bg-black hover:text-yellow-500 text-black ${
                  pathname === sidebar.url && "bg-yellow-500"
                }`}
              >
                <sidebar.icon />
                <h6 className=' uppercase'>{sidebar.title}</h6>
              </Link>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
