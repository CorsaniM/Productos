import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { ClerkProvider} from '@clerk/nextjs'

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner";
import Sidebar from "~/components/sidebar";
import Upbar from "~/components/upbar";
import { SyncActiveOrganization } from "~/components/SyncActiveOrganization";

export const metadata: Metadata = {
  title: "Programa Cardozo",
  description: "IanTech",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};



  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  
    const { sessionClaims } = auth();
  
    
    return (
      <ClerkProvider signInFallbackRedirectUrl={"/"}>
        <SyncActiveOrganization membership={sessionClaims?.membership}/>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className=" bg-slate-100 ">
          <div className="fixed h-16 left-0 w-full bg-blue-600 text-white shadow-md z-20 ">
            <Upbar/>
          </div>
          <div className='fixed pt-16 flex-1 h-full list-none w-36  shadow-2xl bg-blue-800 z-10'>
              <Sidebar/>
          </div>
          <div className='flex-1 pt-16 pl-36'>
              <TRPCReactProvider>
                {children}
                <Toaster />
              </TRPCReactProvider>
          </div>
        </body>
      </html>
      </ClerkProvider>
    );
  }

