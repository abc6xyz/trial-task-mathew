"use client"

import { getUserLayouts } from '@/app/actions/layout';
import { getUserLayoutWidgets } from '@/app/actions/widget';
import { Layout, Layout_Widgets } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface DashboardContextProps {
  layouts: Layout[];
  selectedLayout: number;
  widgets: Layout_Widgets[];
  fetchLayouts: () => void;
  selectLayout: (layout_id: number) => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [ layouts, setLayouts ] = useState<Layout[]>([])
  const [ selectedLayout, setSelectedLayout ] = useState<number>(-1)
  const [ widgets, setWidgets ] = useState<Layout_Widgets[]>([])

  const { data: session } = useSession()  
  
  const fetchLayouts = async () => {
    if (session) {
      const layouts = await getUserLayouts(session?.user?.email)
      console.log("-- user layout --\n", layouts)
      setLayouts(layouts)
      if (!layouts.length){
        setSelectedLayout(-1)
      }
    }
  }

  const selectLayout = async (layout_id: number) => {
    if (session) {
      setSelectedLayout(layout_id)
      const widgets = await getUserLayoutWidgets(layouts[layout_id]?.layout_id)
      console.log("-- user layout widgets --\n", widgets)
      setWidgets(widgets)
    }
  }

  const dashboardValue: DashboardContextProps = {
    layouts,
    selectedLayout,
    widgets,
    fetchLayouts,
    selectLayout,
  };

  return <DashboardContext.Provider value={dashboardValue}>{children}</DashboardContext.Provider>;
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboard must be used within an DashboardProvider');
  }

  return context;
};
