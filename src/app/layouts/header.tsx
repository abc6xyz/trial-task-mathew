"use client"

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthDialog } from "@/components/dialogs/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import { signInByWallet } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";

export default function Header() {
  const { toast } = useToast()
  const { isConnected, address, connector } = useAccount()
  const { disconnect } = useDisconnect()
  const { status } = useSession()

  useEffect(()=>{
    const signInByWallet_ = async (address : string) => {
      const res = await signInByWallet(address)
      if ( res === "success" )
        toast({
          title: "User signed in.",
        })
      else
        toast({
          title: "Please signin or signup with your account",
        })
    }
    const addWalletByUser_ = async (wallet: {address: string, name: string}) => {
      try {
        const response = await fetch('/api/wallet/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data:wallet}),
        });
        const result = await response.json();
        if ('error' in result){
          console.log(result['error']+' : /api/wallet/create')
        } else {
          toast({
            title: "New wallet detection",
            description: result['data']['address'],
          })
        }
      } catch (error) {
        console.log('Error fetching data from API : /api/wallet/create')
      }
    }
    if (isConnected && address) {
      if (status==='unauthenticated') {
        signInByWallet_(address)
      }
      else {
        addWalletByUser_({
          address:address,
          name:connector?.name === undefined ? "" : connector?.name
        })
      }
    }
  },[isConnected, address, connector, status]);

  function handleSignOut(): void {
    disconnect()
    signOut({ redirect: false })
  }

  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="flex justify-center">
          <div className="block md:!hidden">
            <MobileSidebar />
          </div>
          <div className="hidden md:!block">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
            >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          {
            status === 'authenticated' ?
            <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
            : 
            <AuthDialog />
          }
          <ConnectButton showBalance={false} chainStatus="none" />
        </div>
      </nav>
    </div>
  );
}