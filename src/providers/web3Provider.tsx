"use client";

import * as React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider, lightTheme, darkTheme } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { mainnet, sepolia, goerli, polygonMumbai } from "wagmi/chains";
import { useTheme } from "next-themes";
import { Network } from "alchemy-sdk";

interface Chains {
  [key: string]: Network
}

export const Chains: Chains = {
  [mainnet.name]: Network.ETH_MAINNET,
  [sepolia.name]: Network.ETH_SEPOLIA,
  [goerli.name]: Network.ETH_GOERLI,
  [polygonMumbai.name]: Network.MATIC_MUMBAI
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia, goerli, polygonMumbai],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY! })]
);

const { connectors } = getDefaultWallets({
  appName: "Trial Task Mathew",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const Web3Providers = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false);
  const { theme } = useTheme();

  React.useEffect(() => setMounted(true), []);
  if(!mounted) {
    return null
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={theme === "light" ? lightTheme() : darkTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Web3Providers
