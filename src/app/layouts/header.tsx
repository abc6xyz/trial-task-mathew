"use client"

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useAccount, useDisconnect } from "wagmi";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthDialog } from "@/components/auth-dialog";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import { signInByWallet } from "@/lib/utils";
import { addWalletByUser } from "@/app/actions/user";

export default function Header() {
  const { toast } = useToast()
  const { isConnected, address, connector } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: session } = useSession()
  useEffect(()=>{
    const signInByWallet_ = async (address : string) => {
      const res = await signInByWallet(address)
      if ( res === "success" )
        toast({ title: "Info",
          description: "User signed in. \n Email: " + session?.user?.email,
        })
      else
        toast({ title: "Info",
          description: "Please signin or signup with your account",
        })
    }
    const addWalletByUser_ = async (wallet: {address: string, name: string}) => {
      const res = await addWalletByUser(wallet, session?.user?.email as string);
      if (res === "success")
        toast({ title: "Info",
          description: "Wallet info is added to your account",
        })
    }
    if (isConnected && address) {
      if (session===null) {
        signInByWallet_(address)
      }
      else {
        addWalletByUser_({
          address:address,
          name:connector?.name === undefined ? "" : connector?.name
        })
      }
    }
  },[isConnected, address, connector, session]);

  function handleSignOut(): void {
    disconnect()
    signOut({ redirect: false })
  }

  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-end lg:justify-between px-4">
        <div className="hidden lg:block">
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

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          {
            session?
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