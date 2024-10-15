"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-cover bg-no-repeat flex flex-col gap-16 md:pt-10 lg:pt-24 pb-24 lg:px-8 xl:px-24 px-4 max-w-screen-2xl mx-auto",
        className
      )}
      {...props}
    />
  )
);
Container.displayName = "Container";

const ContainerAuth = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-cover min-h-screen bg-testimonial_bg bg-no-repeat flex items-center justify-center py-20 lg:py-24 px-4 lg:px-8 xl:px-24 max-w-screen-2xl mx-auto",
        className
      )}
      {...props}
    />
  )
);
ContainerAuth.displayName = "ContainerAuth";

const ContainerDashboard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex relative flex-col gap-10 py-5 px-[16px] md:pr-12", className)} {...props} />
  )
);
ContainerDashboard.displayName = "ContainerDashboard";

const DashboardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children }, ref) => (
    <div
      ref={ref}
      className={cn("flex sticky px-5 bg-black py-2 z-50 top-[83px] items-center justify-between", className)}
    >
      {children}
    </div>
  )
);
DashboardHeader.displayName = "DashboardHeader";

const NavigateBack = ({ children }: { children: React.ReactNode }) => {
  const navigation = useRouter();
  return (
    <div onClick={() => navigation.back()} className={cn("cursor-pointer flex items-center gap-3")}>
      {children}
    </div>
  );
};

NavigateBack.displayName = "NavigateBack";

export { Container, ContainerAuth, ContainerDashboard, DashboardHeader, NavigateBack };
