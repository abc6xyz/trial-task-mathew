import React, { useState } from 'react';
import type { LayoutsIF } from 'react-dashboard-pro';
import Dashboard from 'react-dashboard-pro';
import allWidgets from '@/components/widgets';
import { useDashboard } from '@/providers/dashboardProvider';

export default function DashboardPro() {
  const [layout, setLayout] = useState<LayoutsIF>([]);
  const { widgets, selectedLayout, layouts } = useDashboard()
  const onLayoutChange = (layout: LayoutsIF) => {
    setLayout(layout);
  };

  return (
    <div className='w-full h-full pt-14'>
      {
        selectedLayout ?
        <div className='flex-1 space-y-4 p-8 pt-6'>
          <div className='flex items-center justify-between space-y-2'>
            <h2 className="text-3xl font-bold tracking-tight">
              {layouts?.find(layout => layout?.layout_id === selectedLayout)?.layout_name}
            </h2>
          </div>
          <div className='space-y-4'>
            <Dashboard
              widgets={allWidgets}
              onLayoutChange={onLayoutChange}
              layout={layout}
              editMode={false}
            />
          </div>
        </div>
        :
        <></>
      }
    </div>
  );
};
