"use server"

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { generateHash } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await prisma.$connect()

  if (req.method === 'POST') {
    try {
      const {email, password, address} = req.body.data;
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })
      if(user) res.status(200).json({ error: 'Already exist' });

      const passwordHash = generateHash(password)

      const newUser = await prisma.user.create({
        data: {
          email,
          password: passwordHash,
          address,
        },
      })
      if(!newUser) res.status(200).json({ error: 'Failed to create' });

      res.status(200).json({success: true, data: {user_id: newUser.id}});
    } catch (error) {
      console.error('**** Error @ api/user/index.ts ****\n', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

  await prisma.$disconnect()
}