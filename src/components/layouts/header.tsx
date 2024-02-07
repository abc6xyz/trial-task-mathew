"use client"

import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AuthDialog } from "@/components/auth-dialog";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect } from "react";
import { addWalletByUser, getUserByWallet } from "@/app/actions/user";
import { useToast } from "@/components/ui/use-toast"

export default function Header() {
  const { toast } = useToast()
  const { isConnected, address, connector } = useAccount();
  const { disconnect } = useDisconnect()
  const { data: session, status } = useSession();

  useEffect(()=>{
    const getUserByWallet_ = async (address : any) => {
      try {
        let res = await getUserByWallet(address);
        if (!res?.success) {
          toast({
            title: "Error",
            description: "Reason: "+ res.data,
          })
        }
        let user = res?.data
        const data = await signIn("credentials", {
          email: user.email,
          password: user.password,
          encrypt: true,
          redirect: false
        })
        if (data?.ok){
          toast({
            title: "Info",
            description: "User signed in\nEmail: "+ user?.email,
          })
        }
        else{
          toast({
            title: "Info",
            description: "Please signin or signup with your account",
          })
        }
      } catch (error) {
        console.error('Error fetching user data by wallet address:', error);
      }
    }
    const addWalletByUser_ = async (wallet : any) => {
      try {
        let res = await addWalletByUser(wallet, session?.user?.email);
        if (res.success) {
          toast({
            title: "Info",
            description: "Wallet info is added to your account",
          })
        }
      } catch (error) {
        console.error('Error adding wallet by user data:', error);
      }
    }
    if (isConnected && address) {
      if (session===null) {
        getUserByWallet_(address);
      }
      else {
        addWalletByUser_({
          address:address,
          name:connector?.name
        })
      }
    }
  },[isConnected, session]);

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