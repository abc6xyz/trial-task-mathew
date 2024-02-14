import "./globals.css";

import { Inter } from "next/font/google";
import ThemeProvider from "@/providers/themeProvider";
import SessionProvider from "@/providers/sessionProvider";
import Web3Providers from "@/providers/web3Provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
      {/* <body className={inter.className}> */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <Web3Providers>
              <main>{children}</main>
              <Toaster />
            </Web3Providers>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
