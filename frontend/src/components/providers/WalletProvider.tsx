'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { JSONRpcProvider } from 'opnet';
import type { OPNetSigner } from '@/services/wallet';
import type { OpnetConfig } from '@/lib/opnet';

interface WalletContextType {
    walletAddress: string | null;
    publicKey: string | null;
    balance: number;
    provider: JSONRpcProvider | null;
    signer: OPNetSigner | null;
    network: any;
    connecting: boolean;
    opnetConfig: OpnetConfig;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet(): WalletContextType {
    const ctx = useContext(WalletContext);
    if (!ctx) throw new Error('useWallet must be used within WalletProvider');
    return ctx;
}

export default function WalletProvider({ children }: { children: React.ReactNode }) {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [balance, setBalance] = useState(0);
    const [provider, setProvider] = useState<JSONRpcProvider | null>(null);
    const [signer, setSigner] = useState<OPNetSigner | null>(null);
    const [network, setNetwork] = useState<any>(null);
    const [connecting, setConnecting] = useState(false);

    const getWallet = useCallback(async () => await import('@/services/wallet'), []);

    useEffect(() => {
        const check = async () => {
            try {
                const w = await getWallet();
                if (!w.isWalletAvailable()) return;
                const wp = w.getWalletProvider();
                const accounts = await wp?.getAccounts();
                if (accounts && accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    setPublicKey(await w.getPublicKey());
                    setProvider(w.createProvider());
                    setNetwork(w.getBitcoinNetwork());
                    setBalance(await w.getBalance());
                    try { setSigner(await w.createSigner()); } catch {}
                }
            } catch {}
        };
        check();
    }, [getWallet]);

    const connect = useCallback(async () => {
        setConnecting(true);
        try {
            const w = await getWallet();
            const { address, publicKey: pk } = await w.connectWallet();
            setWalletAddress(address);
            setPublicKey(pk);
            setProvider(w.createProvider());
            setNetwork(w.getBitcoinNetwork());
            setBalance(await w.getBalance());
            try { setSigner(await w.createSigner()); } catch {}
        } catch (e: any) {
            alert(e?.message || 'Failed to connect');
        } finally {
            setConnecting(false);
        }
    }, [getWallet]);

    const disconnect = useCallback(() => {
        setWalletAddress(null); setPublicKey(null); setBalance(0);
        setSigner(null); setProvider(null); setNetwork(null);
    }, []);

    const opnetConfig: OpnetConfig = {
        provider,
        network,
        publicKey: publicKey || undefined,
        signer: signer || undefined,
        walletAddress: walletAddress || undefined,
    };

    return (
        <WalletContext.Provider value={{ walletAddress, publicKey, balance, provider, signer, network, connecting, opnetConfig, connect, disconnect }}>
            {children}
        </WalletContext.Provider>
    );
}
