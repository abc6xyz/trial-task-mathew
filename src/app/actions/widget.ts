"use server"

import { prisma } from "@/lib/prisma"
import { Layout_Widgets, Widget } from "@prisma/client"

export async function getAllWidgets(): Promise<Widget[] | null> {
  try {
    const widgets = await prisma.widget.findMany();
    return widgets
  } catch (error) {
    return null
  }
}

export async function getUserLayoutWidgets(layout_id: number): Promise<Layout_Widgets[]> {
  try {
    const layoutWidgets = await prisma.layout.findUnique({
      where: { layout_id: layout_id },
      include: { widgets: true },
    });

    if (!layoutWidgets?.widgets) return []
    return layoutWidgets?.widgets
  } catch (error) {
    return []
  }
}