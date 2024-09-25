"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-cover bg-no-repeat flex flex-col gap-16 md:pt-10 lg:pt-24 pb-24 lg:px-8 xl:px-24 px-4 max-w-screen-2xl mx-auto",
      className
    )}
    {...props}
  />
));
Container.displayName = "Container";

const ContainerAuth = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-cover min-h-screen bg-testimonial_bg bg-no-repeat flex items-center justify-center py-20 lg:py-24 px-4 lg:px-8 xl:px-24 max-w-screen-2xl mx-auto",
      className
    )}
    {...props}
  />
));
ContainerAuth.displayName = "ContainerAuth";

const ContainerDashboard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-cover bg-no-repeat flex flex-col gap-16 pt-24 pb-24 lg:px-8 px-4 max-w-screen-2xl mx-auto",
      className
    )}
    {...props}
  />
));
ContainerDashboard.displayName = "ContainerDashboard";

const DashboardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children }, ref) => (
  <div
    ref={ref}
    className={cn(
      "max-w-screen-2xl border-b border-gray-800 z-10 px-4 sm:px-8 flex justify-between items-center mx-auto fixed top-[42px] left-0 right-0 h-[76px] ",
      className
    )}
  >
    {children}
  </div>
));
DashboardHeader.displayName = "DashboardHeader";

const DashboardHeaderBack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-6 ", className)}>
    <ArrowLeft className="h-5 w-5" />
    {children}
  </div>
));
DashboardHeaderBack.displayName = "DashboardHeaderBack";

const NavigateBack = ({ children }: { children: React.ReactNode }) => {
  const navigation = useRouter();
  return (
    <div
      onClick={() => navigation.back()}
      className={cn("cursor-pointer flex items-center gap-3")}
    >
      {children}
    </div>
  );
};

NavigateBack.displayName = "NavigateBack";

export {
  Container,
  ContainerAuth,
  ContainerDashboard,
  DashboardHeader,
  DashboardHeaderBack,
  NavigateBack,
};
