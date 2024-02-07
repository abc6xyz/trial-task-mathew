import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { createHash } from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateHash(data: string): string {
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}
