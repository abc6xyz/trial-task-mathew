"use server"

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOption } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOption);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await prisma.$connect()

  if (req.method === 'POST') {
    try {
      const { title, widgets } = req.body.data;
  
      const new_layout = await prisma.layout.create({
        data: {
          user: {
            connect: { id: session.user.id },
          },
          layout_name: title,
        },
      });
      const widget_json = {
        x:0,
        y:0,
        w:2,
        h:2,
      }
      const layout_widgets = widgets.map((widget: number) => {
        return {
          layout_id: new_layout.layout_id,
          widget_id: widget,
          widget_json: widget_json,
        };
      });
    
      await prisma.layout_Widgets.createMany({
        data: layout_widgets,
      });
      
      res.status(200).json({
        success:true,
        data: new_layout,
      });
    } catch (error) {
      console.error('**** Error @ api/layout/create.ts ****\n', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

  await prisma.$disconnect()
}