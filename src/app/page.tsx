"use client"

import Header from "./layouts/header";
import Sidebar from "./layouts/sidebar";
import DashboardPro from "./layouts/dashboard";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDashboard } from "@/providers/dashboardProvider";

export default function Home() {
  const { data:session } = useSession()
  const { fetchLayouts } = useDashboard()

  useEffect(() => {
    if (session) {
      fetchLayouts()
    }
  },[session])

  return (
    <div>
      <Header />
      {
        session?
        <div className="w-full flex">
          <Sidebar />
          <DashboardPro />
        </div>
        :
        <></>
      }
    </div>
  );
}
