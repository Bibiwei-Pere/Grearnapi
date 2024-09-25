"use client";

import React from "react";

import { FaWhatsapp } from "react-icons/fa6";

function WhatsApp() {
  const handleClick = async () => {
    // Check if WhatApp installed, if yes open whatsapp else open whatsapp web
    if (navigator.userAgent.includes("WhatsApp")) {
      // WhatsApp is installed
      window.open(`https://api.whatsapp.com/send?phone=2347064699173`);
    } else {
      // WhatsApp is not installed, open WhatsApp Web
      // WhatsApp is installed
      window.open(`https://api.whatsapp.com/send?phone=2347064699173`);
    }
  };
  return (
    <>
      <div
        className="bg-green-600 w-min animate-bounce p-2 rounded-full fixed 
        bottom-10 right-4 cursor-pointer md:right-8
         hover:bg-[#A700AF] shadow-lg hover:text-white shadow-green-600 transform transition-all duration-1000 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce
        "
        onClick={handleClick}
      >
        <FaWhatsapp color="white" className="w-7 h-7 md:w-10 md:h-10" />
      </div>
    </>
  );
}

export default WhatsApp;
