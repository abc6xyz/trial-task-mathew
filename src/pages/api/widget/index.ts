"use server"

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await prisma.$connect()

  if (req.method === 'GET') {
    try {
      const widgets = await prisma.widget.findMany();

      if(!widgets) res.status(200).json({ error: 'Failed to fetch widgets' });

      res.status(200).json({success: true, data: widgets});
    } catch (error) {
      console.error('**** Error @ api/widget/index.ts ****\n', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

  await prisma.$disconnect()
}