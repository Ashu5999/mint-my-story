import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiProvider } from 'wagmi'
import { mainnet, polygon, arbitrum, optimism, base } from 'wagmi/chains'
import { QueryClient } from '@tanstack/react-query'

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

// 2. Create wagmiConfig
const metadata = {
  name: 'Mint2Story',
  description: 'Transform your AI-generated stories into collectible NFTs',
  url: 'https://mint2story.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, polygon, arbitrum, optimism, base] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true
})

export { WagmiProvider, QueryClient }
