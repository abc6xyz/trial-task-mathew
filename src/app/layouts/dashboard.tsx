"use client"

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { useTheme } from 'next-themes';
import { useEditWidget } from "@/hooks/useEditWidget";
import React, { useCallback, useEffect, useState } from 'react';
import { DeleteDashboard } from '@/components/dialogs/delete-dashboard';
import { Button } from '@/components/ui/button';
import { AddWidget } from '@/components/dialogs/add-widget';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { Layout_Widgets } from '@prisma/client';
import { toast } from '@/components/ui/use-toast';
import DashboardWidget from '@/components/widgets';
import { Icons } from '@/components/icons';
import { EditWidget } from '@/components/widgets/edit';
import { cn } from '@/lib/utils';
import _ from 'lodash';
import { ActionButton } from "@/components/action-button";
import { WIDGETS } from "@/const";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

type DashboardLayoutProps = {
  className?: string;
  cols?: { [key: string]: number };
  rowHeight?: number;
  selectedLayout: number;
  layoutName: string | undefined;
};

export default function DashboardPro ({
  className = "layout",
  cols = { '2xl': 30, 'xl': 28, 'lg': 23, 'md': 18, 'sm': 14, 'xs': 11, 'xxs': 8 },
  rowHeight = 50,
  selectedLayout = 0,
  layoutName = undefined,
}: DashboardLayoutProps) {
  const { theme } = useTheme()
  const { setOpen } = useEditWidget()

  const [ isDraggableResizable, setIsDraggableResizable ] = useState(false)
  const [ widgets, setWidgets ] = useState<Layout_Widgets[] | undefined>(undefined);
  const [ columns, setColumns ] = useState<number>(cols[getWindowSize()])
  
  function getWindowSize(): string {
    const breakpoints: {
      [key: string]: MediaQueryList;
    } = {
      'xxs': window.matchMedia('(max-width: 479px)'),
      'xs': window.matchMedia('(min-width: 480px) and (max-width: 639px)'),
      'sm': window.matchMedia('(min-width: 640px) and (max-width: 767px)'),
      'md': window.matchMedia('(min-width: 768px) and (max-width: 1023px)'),
      'lg': window.matchMedia('(min-width: 1024px) and (max-width: 1279px)'),
      'xl': window.matchMedia('(min-width: 1280px) and (max-width: 1535px)'),
      '2xl': window.matchMedia('(min-width: 1536px)'),
    };
    for (const breakpoint in breakpoints) {
      if (breakpoints[breakpoint].matches) {
        return breakpoint;
      }
    }
    return 'lg';
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('/api/layout/widget', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data:{
              layoutId: selectedLayout,
          }}),
        })
        const result = await response.json()
        if ('error' in result) {
          toast({
            title: result['error'],
          })
        } else {
          setWidgets(result['data'])
        }
      } catch (error) {
        toast({
          title: 'Error fetching data from API',
        })
      }
    }
    if(selectedLayout){
      setIsDraggableResizable(false)
      setWidgets(undefined)
      fetchDashboard()
    }
  }, [selectedLayout])

  const onAddItem = useCallback(async (widget_id: number) => {
    let grid: boolean[][] = [];
    const { width, height } = WIDGETS[widget_id]
    for (let i=0; i<100; i++) {
      let row: boolean[] = []
      for (let j=0; j<columns; j++) {
        row.push(false)
      }
      grid.push(row)
    }
    widgets?.map((widget)=>{
      for (let i=0; i<(widget.widget_json as any).h; i++)
        for (let j=0; j<(widget.widget_json as any).w; j++)
          grid[(widget.widget_json as any).y+i][(widget.widget_json as any).x+j] = true
    })
    for (let i=0; i<100-height; i++) {
      for (let j=0; j<columns-width; j++) {
        let mark = true
        for (let h=0; h<height; h++) {
          for (let w=0; w<width; w++) {
            if(grid[i+h][j+w]) mark = false
          }
        }
        if (mark) {
          const response = await fetch('/api/widget/create',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: {
                layoutId: selectedLayout,
                widgetId: widget_id,
                widgetJson: {
                  h:height,
                  w:width,
                  x:j,
                  y:i,
                }
              }
            }),
          })
          const result = await response.json()
          if ('success' in result && result.success) {
            setWidgets([...(widgets as any), result.data])
          }
          return
        }
      }
    }
  }, [columns, widgets, selectedLayout]);

  const onBreakpointChange = (breakpoint: any, cols: any) => {
    setColumns(cols)
  }

  const onLayoutChangeCallback = (layouts: Layout[]) => {
    let newWidgets = widgets;
    layouts.map((layout)=>{
      let indexOfWidgetToUpdate = newWidgets?.findIndex((newWidget) => newWidget.layout_widget_id === parseInt(layout.i));
      if (indexOfWidgetToUpdate !== -1 && indexOfWidgetToUpdate!==undefined &&newWidgets!==undefined) {
        newWidgets[indexOfWidgetToUpdate].widget_json = {
          ...newWidgets[indexOfWidgetToUpdate].widget_json as any,
          x: layout.x,
          y: layout.y,
          h: layout.h,
          w: layout.w,
        };
      }
    })
    setWidgets(newWidgets)
  }

  const onRemoveItem = useCallback(
    async (i: number) => {
      const response = await fetch('/api/widget/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data:{
            layoutWidgetId: i,
        }}),
      })
      const result = await response.json()
      if('success' in result && result.success) {
        setWidgets((prevWidgets) => _.reject(prevWidgets, { layout_widget_id: i }));
      }
    },
    [setWidgets]
  );

  function onEditItem(layout_widget_id: number) {
    setOpen(true, widgets?.find(widget => widget.layout_widget_id === layout_widget_id))
  }

  const saveCallback = (data: any) => {
    const newWidgets = widgets?.map((widget) => {
      if (widget.layout_widget_id === data.id){
        let widget_json: object = widget.widget_json as object;
        widget.widget_json = {
          ...widget_json,
          ...data["data"]
        }
      }
      return widget
    })
    setWidgets(newWidgets)
  }

  const createElement = useCallback(
    (widget: Layout_Widgets) => {
      const data = {
        i: widget.layout_widget_id.toString(),
        x: (widget.widget_json as any)?.x,
        y: (widget.widget_json as any)?.y,
        w: (widget.widget_json as any)?.w,
        h: (widget.widget_json as any)?.h,
      }
      return widget && (
        <div key={data.i} data-grid={data} className={cn("border relative", theme==="dark"?"border-white":"border-black")}>
          <DashboardWidget widget={widget} />
          { isDraggableResizable && 
            <>
              <div className="absolute left-0 top-0 w-full h-full bg-opacity-100 cursor-pointer"></div>
              <Icons.recycleBin className={cn("absolute inset-x-full -right-[24px] top-0 cursor-pointer hover:fill-[#FF0000] z-10000", theme==='dark'&&"fill-[#FFFFFF]")} onClick={() => onRemoveItem(widget.layout_widget_id)} />
              <Icons.edit className={cn("absolute inset-x-full -right-[24px] top-[24px] cursor-pointer hover:fill-[#00FF00] z-10000", theme==='dark'&&"fill-[#FFFFFF]")} onClick={() => onEditItem(widget.layout_widget_id)} />
            </>
          }
        </div>
      );
    }, [isDraggableResizable, widgets, theme]
  );

  const handleSave = useCallback(
    async () => {
      try {
        const response = await fetch('/api/layout/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(widgets),
        });
        const result = await response.json();
        if ('error' in result){
          toast({
            title: result['error'],
          })
        } else {
          toast({
            title: "Successfully saved",
          })
        }
      } catch (error) {
        toast({
          title: 'Error fetching data from API',
        })
      }
      setIsDraggableResizable(false)
    }, [widgets]
  );

  const handleEdit = () => {
    setIsDraggableResizable(true)
  }

  return (
    <ScrollArea className='w-full h-screen pt-14'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className="text-3xl font-bold tracking-tight">
            {layoutName}
          </h2>
          <div className="flex items-center space-x-2">
            { isDraggableResizable?
              <>
                <AddWidget onAddCallback={onAddItem}/>
                <ActionButton callbackFunc={handleSave} text="Save" className="bg-green-500 text-white"/>
              </>
              :
              <Button onClick={handleEdit}>Edit</Button>
            }
            <DeleteDashboard />
          </div>
        </div>
        <div className='space-y-4'>
          {
            widgets ?
            <div>
              <ResponsiveReactGridLayout
                onLayoutChange={onLayoutChangeCallback}
                onBreakpointChange={onBreakpointChange}
                className={className}
                cols={cols}
                rowHeight={rowHeight}
                isDraggable={isDraggableResizable}
                isResizable={isDraggableResizable}
              >
                {widgets.map((widget) => createElement(widget))}
              </ResponsiveReactGridLayout>
            </div>
            :
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-8 w-[200px]" />
              </div>
            </div>
          }
        </div>
      </div>
      <EditWidget saveCallback={saveCallback}/>
    </ScrollArea>
  );
};
