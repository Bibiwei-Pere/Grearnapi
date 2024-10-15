import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "./context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grearn - Future of Agriculture",
  description: "We bring Agriculture to your doorsteps.",
  keywords:
    "Instructor Accessibility and Feedback, Save Time and Money, Community Forums and Groups, User-Friendly Interface, Robust Analytics and Reporting, Flexible Payment Options",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head></head>
      <body className={inter.className}>
        <AuthProvider>
          <Providers>{children}</Providers>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
