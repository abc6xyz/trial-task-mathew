import "./globals.css";

import { Inter } from "next/font/google";
import AuthProvider from "@/providers/sessionProvider";
import ThemeProvider from "@/providers/themeProvider";
import Web3Providers from "@/providers/web3Provider";
import { Toaster } from "@/components/ui/toaster";
import { DashboardProvider } from "@/providers/dashboardProvider";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Web3Providers>
            <DashboardProvider>
              <main>{children}</main>
              <Toaster />
            </DashboardProvider>
          </Web3Providers>
        </ThemeProvider>
      </AuthProvider>
      </body>
    </html>
  );
}
