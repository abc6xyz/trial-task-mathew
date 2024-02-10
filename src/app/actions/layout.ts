"use server"

import { prisma } from "@/lib/prisma"
import { Layout } from "@prisma/client"

export async function getUserLayouts(userEmail: string | null | undefined): Promise<Layout[]> {
  try {
    if (!userEmail) return []
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      select: {
        id: true,
      },
    });

    if (!user) return []

    const layouts = await prisma.layout.findMany({
      where: {
        user_id: user.id,
      },
    });
    return layouts
  } catch (error) {
    return []
  }
}

export async function setUserLayout(userEmail: string | null | undefined, layout_name: string, widgets: number[]): Promise<boolean> {
  try {
    if (!userEmail) return false

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      select: {
        id: true,
      },
    });

    if (!user) return false

    const newLayout = await prisma.layout.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        layout_name: layout_name,
      },
    });
  
    const layoutWidgets = widgets.map((widget) => {
      return {
        layout_id: newLayout.layout_id,
        widget_id: widget,
        widget_json: {},
      };
    });
  
    await prisma.layout_Widgets.createMany({
      data: layoutWidgets,
    });

    return true
  } catch (error) {
    return false
  }
}