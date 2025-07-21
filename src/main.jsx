import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter, WalletConnectWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import './index.css'
import App from './App.jsx'

const network = import.meta.env.VITE_SOLANA_NETWORK === 'mainnet' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  // new BackpackWalletAdapter(),
  new WalletConnectWalletAdapter({
    network,
    options: { projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID },
  }),
];

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </StrictMode>,
)

// src/main.tsx



