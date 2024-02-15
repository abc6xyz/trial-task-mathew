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
      const { layoutId } = req.body.data;
  
      const deletedLayout = await prisma.layout.delete({
        where: {
          layout_id: layoutId,
        },
      });

      if (!deletedLayout) return res.status(200).json({error: "Failed to delete layout"})
      
      res.status(200).json({
        success:true,
        data: deletedLayout,
      });
    } catch (error) {
      console.error('**** Error @ api/layout/delete.ts ****\n', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

  await prisma.$disconnect()
}