"use server"

import { type User } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { PrismaClientInitializationError } from "@prisma/client/runtime/library"

export async function getUserById(id: number): Promise<any> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    return {success:true, data:user}
  } catch (error) {
    if (error instanceof PrismaClientInitializationError){
      return { success:false, data:"database" }
    }
    return { success:false, data:"unkown" }
  }
}

export async function getUserByEmail(email: string): Promise<any> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return {success:user?true:false, data:user}
  } catch (error) {
    if (error instanceof PrismaClientInitializationError){
      return { success:false, data:"database" }
    }
    return { success:false, data:"unkown" }
  }
}

export async function getUserByWallet(wallet: `0x${string}`): Promise<any> {
  try {
    const walletData = await prisma.wallet.findUnique({
      where: {
        address: wallet
      },
      include: {
        user: true
      }
    });

    return { success:walletData?.user?true:false, data:walletData?.user as User }
  } catch (error) {
    if (error instanceof PrismaClientInitializationError){
      return { success:false, data:"database" }
    }
    return { success:false, data:"unkown" }
  }
}

export async function addWalletByUser(wallet: any, userEmail: any): Promise<any> {
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

    return { success:true, data:"success" }
  } catch (error) {
    if (error instanceof PrismaClientInitializationError){
      return { success:false, data:"database" }
    }
    return { success:false, data:"unkown" }
  }
}