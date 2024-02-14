"use server"

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOption } from '@/lib/auth';
import { getSession } from 'next-auth/react';

/*
  TODO: fetch layouts associated with authenticated user
*/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOption);
  // const session = await getSession({req})
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await prisma.$connect()

  if (req.method === 'GET') {
    try {
      await prisma.$connect()
      const layouts = await prisma.layout.findMany({
        where: {
          user_id: 1,
        },
      });
      res.status(200).json({success: true, data: layouts});
    } catch (error) {
      console.error('**** Error @ api/layout/index.ts ****\n', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

  await prisma.$disconnect()
}