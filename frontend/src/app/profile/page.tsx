'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/components/providers/WalletProvider';
import { MOCK_NFTS } from '@/lib/mock-data';
import { getAllNFTs } from '@/lib/opnet';
import NFTGrid from '@/components/nft/NFTGrid';
import { formatBTCShort, formatAddress } from '@/services/wallet';
import type { NFTWithListing } from '@/types';

type ProfileTab = 'owned' | 'listed';

export default function ProfilePage() {
    const { walletAddress, balance, opnetConfig } = useWallet();
    const [tab, setTab] = useState<ProfileTab>('owned');
    const [nfts, setNfts] = useState<NFTWithListing[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!walletAddress) { setNfts([]); return; }
            setLoading(true);
            try {
                // Try to load on-chain NFTs owned by user
                if (opnetConfig.provider) {
                    const all = await getAllNFTs(opnetConfig);
                    const owned = all.filter((n) =>
                        n.owner === walletAddress ||
                        n.owner.toLowerCase().includes(walletAddress.slice(-6).toLowerCase())
                    );
                    if (owned.length > 0) { setNfts(owned); setLoading(false); return; }
                }
            } catch {}
            // Fallback: show mocks as demo
            const mocked = MOCK_NFTS.slice(0, 4).map((n) => ({ ...n, owner: walletAddress, isMock: true }));
            setNfts(mocked);
            setLoading(false);
        };
        load();
    }, [walletAddress, opnetConfig.provider]);

    const ownedNfts = nfts;
    const listedNfts = nfts.filter((n) => n.listing?.active);
    const displayNfts = tab === 'listed' ? listedNfts : ownedNfts;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="profile-header">
                <div className="avatar">
                    {walletAddress ? walletAddress.slice(-2).toUpperCase() : '?'}
                </div>
                <div className="address">
                    {walletAddress ? formatAddress(walletAddress) : 'Not connected'}
                </div>
                {walletAddress && (
                    <div className="text-sm text-white/80 font-semibold">
                        {formatBTCShort(balance)} BTC
                    </div>
                )}
            </div>

            {!walletAddress ? (
                <div className="text-center py-16 text-os-text-secondary">
                    <p className="text-lg font-medium mb-2">Connect your wallet</p>
                    <p className="text-sm">Connect OP_WALLET to view your NFTs</p>
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className="max-w-md mx-auto">
                        <div className="profile-tabs">
                            <button
                                onClick={() => setTab('owned')}
                                className={`profile-tab ${tab === 'owned' ? 'active' : ''}`}
                            >
                                Owned ({ownedNfts.length})
                            </button>
                            <button
                                onClick={() => setTab('listed')}
                                className={`profile-tab ${tab === 'listed' ? 'active' : ''}`}
                            >
                                Listed ({listedNfts.length})
                            </button>
                        </div>
                    </div>

                    <NFTGrid nfts={displayNfts} loading={loading} />
                </>
            )}
        </div>
    );
}
