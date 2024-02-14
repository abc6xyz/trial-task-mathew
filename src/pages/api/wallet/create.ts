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
      const { address, name } = req.body.data;

      const newWallet = await prisma.wallet.create({
        data: {
          address,
          name,
          user: {
            connect: { id: session.user.id }, // Connect the wallet to the user
          },
        },
      });

      if(newWallet) res.status(200).json({ success: true, data: newWallet });
    } catch (error) {
      console.error('**** Error @ api/user/addwallet.ts ****\n', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

  await prisma.$disconnect()
}