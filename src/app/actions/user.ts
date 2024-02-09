"use server"

import { prisma } from "@/lib/prisma"
import { User } from "@prisma/client"

export async function getUserById(id: number): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    return user
  } catch (error) {
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  } catch (error) {
    return null
  }
}

export async function addWalletByUser(wallet: {address: string, name: string}, userEmail: string): Promise<string> {
  try {
    // Create the wallet for the user
    await prisma.wallet.create({
      data: {
        address: wallet.address,
        name: wallet.name,
        user: {
          connect: { email: userEmail }, // Connect the wallet to the user
        },
      },
    });

    return "success"
  } catch (error) {
    return "fail"
  }
}