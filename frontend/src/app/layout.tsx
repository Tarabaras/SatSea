import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import WalletProvider from '@/components/providers/WalletProvider';

export const metadata: Metadata = {
    title: 'SatSea — NFT Marketplace on Bitcoin L1',
    description: 'Discover, collect, and trade NFTs on Bitcoin Layer 1 powered by OP_NET.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-os-bg text-os-text antialiased">
                <WalletProvider>
                    <Navbar />
                    <Sidebar />
                    <main className="ml-16 mt-[72px] min-h-[calc(100vh-72px)]">
                        {children}
                    </main>
                </WalletProvider>
            </body>
        </html>
    );
}
