import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { createHash } from 'crypto';
import { signIn } from "next-auth/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateHash(data: string): string {
  const hash = createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

export async function signInByPassword(email: string, password: string): Promise<string> {
  try {
    const data = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false
    })
    if (data?.ok) return "success"
    return "fail"
  } catch (error) {
    return "fail"    
  }
}

export async function signInByWallet(wallet: string): Promise<string> {
  try {
    const data = await signIn("wallet", {
      wallet: wallet,
      redirect: false
    })
    if (data?.ok) return "success"
    return "fail"
  } catch (error) {
    return "fail"
  }
}
