"use server"

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOption } from '@/lib/auth';

/*
  TODO: delete layout associated with authenticated user
*/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOption);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await prisma.$connect()

  if (req.method === 'POST') {
    try {
      const { widgetId, layoutId, widgetJson } = req.body.data;

      const newLayoutWidget = await prisma.layout_Widgets.create({
        data: {
          layout_id: layoutId,
          widget_id: widgetId,
          widget_json: widgetJson,
        },
      })

      if (!newLayoutWidget) return res.status(200).json({error: "Failed to create layout_widget"})
      
      res.status(200).json({
        success:true,
        data: newLayoutWidget,
      });
    } catch (error) {
      console.error('**** Error @ api/widget/create.ts ****\n', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  await prisma.$disconnect()
}