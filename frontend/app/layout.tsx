import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppToaster } from "@/components/shell/toaster";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Little Royals Kindergarten & Primary School",
  description: "Campus desk for Little Royals Kindergarten & Primary School.",
  icons: { icon: "/logo.png" },
};

const boot = `
try { if (localStorage.getItem("littleroyals-session")) document.documentElement.classList.add("signed-in"); } catch (e) {}
try { var side = localStorage.getItem("littleroyals-sidebar"); if (side === null) side = localStorage.getItem("eduos-sidebar-collapsed"); if (side === "1") document.documentElement.classList.add("sidebar-collapsed"); } catch (e) {}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("h-full", "bg-slate-50", inter.variable, "font-sans", geist.variable)} suppressHydrationWarning>
      <body className={`${inter.className} h-full`}>
        <Script id="littleroyals-boot" strategy="beforeInteractive">
          {boot}
        </Script>
        <TooltipProvider>
          {children}
          <AppToaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
