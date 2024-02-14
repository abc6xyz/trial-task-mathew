"use server"

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOption } from '@/lib/auth';

/*
  TODO: fetch layout_widgets associated with authenticated user
*/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOption);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await prisma.$connect()

  if (req.method === 'POST') {
    try {
      const { layoutId } = req.body.data;
  
      const layoutWidgets = await prisma.layout_Widgets.findMany({
        where: {
          layout_id: layoutId,
        }
      });

      if (!layoutWidgets) return res.status(200).json({error: "Failed to fetch layout_widgets"})
      
      res.status(200).json({
        success:true,
        data: layoutWidgets,
      });
    } catch (error) {
      console.error('**** Error @ api/layout/widget.ts ****\n', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

  await prisma.$disconnect()
}