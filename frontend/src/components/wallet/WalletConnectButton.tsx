'use client';

import { useWallet } from '@/components/providers/WalletProvider';
import { formatAddress, formatBTCShort } from '@/services/wallet';

export default function WalletConnectButton() {
    const { walletAddress, balance, connecting, connect, disconnect } = useWallet();

    if (walletAddress) {
        return (
            <div className="flex items-center gap-3">
                <span className="text-xs text-os-text-secondary hidden md:block">
                    {formatBTCShort(balance)} BTC
                </span>
                <button
                    onClick={disconnect}
                    className="flex items-center gap-2 bg-os-card border border-os-border rounded-xl px-4 py-2.5 text-sm font-semibold text-os-text hover:bg-os-card-hover transition-colors"
                >
                    <div className="w-2 h-2 rounded-full bg-os-green" />
                    {formatAddress(walletAddress)}
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={connect}
            disabled={connecting}
            className="bg-os-blue hover:bg-os-blue-hover text-white rounded-xl px-5 py-2.5 text-sm font-bold transition-colors disabled:opacity-50"
        >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
    );
}
