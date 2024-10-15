"use client";
import React, { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobile, setMobile] = useState(false);

  return (
    <div className='bg-cover bg-no-repeat max-w-screen-2xl min-h-screen mx-auto bg-testimonial_bg'>
      <Sidebar mobile={mobile} setMobile={setMobile} />
      <main
        className={`relative transition-all duration-300 ${
          mobile ? "ml-0 sm:ml-[80px] md:ml-[100px]" : "ml-[330px] md:ml-[350px]"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default Layout;
