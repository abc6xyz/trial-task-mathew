"use client"

import Header from "./layouts/header";
import Sidebar from "./layouts/sidebar";
 
export default function Home() {
  return (
    <div>
      <Header />
      <div className="w-full flex">
        <Sidebar />
      </div>
    </div>
  );
}
