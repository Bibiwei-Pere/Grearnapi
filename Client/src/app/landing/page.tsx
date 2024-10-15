"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Logo from "../components/assets/image/Logo.jpg";
import heroImage from "../components/assets/image/heroImage.jpg";
import Image from "next/image";
import { Reveal3 } from "../components/animations/Reveal";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const navigation = useRouter();

  return (
    <section className='flex min-h-screen mb-10 md:mb-0 items-center justify-center'>
      <section className='bg-black grid grid-flow-row md:grid-flow-col md:grid-cols-[1fr,411px] lg:grid-cols-[1fr,611px] xl:min-h-[969px] items-center justify-center max-w-screen-2xl mx-auto md:gap-20 lg:gap-32'>
        <Image className='absolute left-4 md:left-8 lg:left-[125px] top-[40px]' src={Logo} alt='Logo' />
        <div className='flex relative h-full flex-col pl-4 pr-4 md:pl-10 lg:pl-20 md:pr-0 lg:pr-10 mt-[250px] md:mt-32 pb-10 gap-3 items-center md:items-start justify-center mx-auto'>
          <h4 className='text-green-500'>WELCOME </h4>
          <h1 className='max-w-[457px] xl:max-w-[557px] text-center md:text-left'>
            Empowering Farmers, Connecting Markets
          </h1>

          <Reveal3>
            <p className='max-w-[457px] leading-7 mt-3 text-center md:text-left'>
              Grearn is an innovative app that connects farmers and consumers in Africa, empowering efficient
              agricultural trading and maximizing profits.
            </p>
          </Reveal3>

          <Button variant={"buy"} onClick={() => navigation.push("/auth/login")} className='max-w-[250px] md:ml-0'>
            Login
          </Button>
        </div>
        <div className='relative m-4 md:m-0 max-h-[310px] md:max-h-full rounded-lg md:rounded-none overflow-hidden'>
          <Image className='w-full mx-auto' src={heroImage} alt='heroImage' />
        </div>
      </section>
    </section>
  );
};

export default LandingPage;
