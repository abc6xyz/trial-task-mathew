import "./globals.css";

import { Inter } from "next/font/google";
import { authConfig } from "@/app/api/auth/[...nextauth]/auth-config";
import { getServerSession } from "next-auth";
import SessionProvider from "@/providers/sessionProvider";
import ThemeProvider from "@/providers/themeProvider";
import Web3Providers from "@/providers/web3Provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authConfig);
  console.log("session : ", session)
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Web3Providers>
            <main>{children}</main>
            <Toaster />
          </Web3Providers>
        </ThemeProvider>
      </SessionProvider>
      </body>
    </html>
  );
}
