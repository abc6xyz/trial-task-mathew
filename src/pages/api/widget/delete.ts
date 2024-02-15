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
      const { layoutWidgetId } = req.body.data;

      const deletedLayoutWidget = await prisma.layout_Widgets.delete({
        where: {
          layout_widget_id: layoutWidgetId,
        },
      });

      if (!deletedLayoutWidget) return res.status(200).json({error: "Failed to delete layout_widget"})
      
      res.status(200).json({
        success:true,
        data: deletedLayoutWidget,
      });
    } catch (error) {
      console.error('**** Error @ api/widget/delete.ts ****\n', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  await prisma.$disconnect()
}