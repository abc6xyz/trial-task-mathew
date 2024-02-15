"use server"

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOption } from '@/lib/auth';
import { Layout_Widgets } from '@prisma/client';

/*
  TODO: save layout associated with authenticated user
*/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOption);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await prisma.$connect()

  if (req.method === 'POST') {
    try {
      const updatedLayoutWidgets = req.body;

      const updatedResult = await prisma.$transaction(
        updatedLayoutWidgets.map((item: Layout_Widgets) =>
          prisma.layout_Widgets.update({
            where: { layout_widget_id: item.layout_widget_id },
            data: {
              widget_json: item.widget_json !== null ? item.widget_json : undefined,
            },
          })
        )
      );
      
      res.status(200).json({
        success:true,
        updatedResult,
      });
    } catch (error) {
      console.error('**** Error @ api/layout/save.ts ****\n', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

  await prisma.$disconnect()
}