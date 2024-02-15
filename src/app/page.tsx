"use client"

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "./layouts/header";
import Sidebar from "./layouts/sidebar";
import DashboardPro from "./layouts/dashboard";
import { useSidebar } from "@/hooks/useSidebar";
import { toast } from "@/components/ui/use-toast";

export default function Home() {
  const { status } = useSession()
  const { setLayouts, selectedLayout } = useSidebar()

  useEffect(()=>{
    const fetchLayouts = async () => {
      const response = await fetch('/api/layout')
      const result = await response.json()
      if ( 'error' in result ) {
        toast({
          title: result['error']
        })
      } else {
        setLayouts(result['data'])
      }
    }
    if (status === 'authenticated') {
      fetchLayouts()
    }
  },[status, setLayouts])
  return (
    <div>
      <Header />
      {
        status === "authenticated"?
        <div className="w-full flex">
          <Sidebar />
          { selectedLayout &&
            <DashboardPro />
          }
        </div>
        :
        <></>
      }
    </div>
  );
}
