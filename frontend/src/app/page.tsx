'use client';

import { useState, useEffect } from 'react';
import NFTGrid from '@/components/nft/NFTGrid';
import { MOCK_NFTS, MOCK_COLLECTIONS } from '@/lib/mock-data';
import { useWallet } from '@/components/providers/WalletProvider';
import { getAllNFTs } from '@/lib/opnet';
import type { NFTWithListing } from '@/types';
import { formatBTCShort } from '@/services/wallet';
import Link from 'next/link';

export default function HomePage() {
    const { opnetConfig } = useWallet();
    const mockWithFlag = MOCK_NFTS.map((n) => ({ ...n, isMock: true }));
    const [nfts, setNfts] = useState<NFTWithListing[]>(mockWithFlag);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'listed'>('all');

    useEffect(() => {
        const load = async () => {
            if (opnetConfig.provider) {
                setLoading(true);
                try {
                    const onChain = await getAllNFTs(opnetConfig);
                    // Show on-chain NFTs first, then mocks as demo
                    if (onChain.length > 0) {
                        setNfts([...onChain, ...mockWithFlag]);
                    }
                } catch {}
                setLoading(false);
            }
        };
        load();
    }, [opnetConfig.provider]);

    const listedNfts = nfts.filter((n) => n.listing?.active);
    const displayNfts = filter === 'listed' ? listedNfts : nfts;

    return (
        <div className="p-6">
            {/* Hero */}
            <div className="hero-banner">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white/80 mb-4">
                        <span className="w-2 h-2 rounded-full bg-os-green animate-pulse" />
                        OP_NET Testnet
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                        Discover & Collect<br />
                        <span className="text-os-orange">Bitcoin NFTs</span>
                    </h1>
                    <p className="text-sm md:text-base text-white/60 mb-6 max-w-lg">
                        The first NFT marketplace on Bitcoin Layer 1. Mint, buy, and sell NFTs directly on Bitcoin using OP_NET.
                    </p>
                    <div className="flex gap-3">
                        <Link href="/create" className="btn-orange inline-block !w-auto !px-6 !py-3 text-sm">
                            Mint NFT
                        </Link>
                        <button
                            onClick={() => setFilter('listed')}
                            className="btn-secondary !w-auto !px-6 !py-3 text-sm !bg-white/10 !border-white/20 hover:!bg-white/20"
                        >
                            Browse Market
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-label">Total NFTs</div>
                    <div className="stat-value">{nfts.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Listed</div>
                    <div className="stat-value">{listedNfts.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Floor Price</div>
                    <div className="stat-value text-os-orange">
                        {listedNfts.length > 0
                            ? `₿ ${formatBTCShort(Math.min(...listedNfts.map((n) => n.listing!.price)))}`
                            : '—'
                        }
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Collections</div>
                    <div className="stat-value">{MOCK_COLLECTIONS.length}</div>
                </div>
            </div>

            {/* Trending Collections */}
            <div className="section-header">
                <h2 className="section-title">Trending Collections</h2>
            </div>
            <div className="trending-grid">
                {MOCK_COLLECTIONS.slice(0, 6).map((col, i) => (
                    <div key={i} className="trending-card">
                        <img src={col.image} alt={col.name} />
                        <div className="info">
                            <div className="name">{col.name}</div>
                            <div className="floor">
                                Floor: ₿ {formatBTCShort(col.floor)}
                                <span className={`ml-2 ${col.change >= 0 ? 'text-os-green' : 'text-os-red'}`}>
                                    {col.change >= 0 ? '+' : ''}{col.change}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* NFT Grid */}
            <div className="section-header">
                <h2 className="section-title">
                    {filter === 'listed' ? 'Listed NFTs' : 'All NFTs'}
                </h2>
                <div className="flex gap-1 bg-os-card rounded-lg p-1">
                    {(['all', 'listed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                filter === f
                                    ? 'bg-os-card-hover text-os-text'
                                    : 'text-os-text-secondary hover:text-os-text'
                            }`}
                        >
                            {f === 'all' ? 'All' : 'For Sale'}
                        </button>
                    ))}
                </div>
            </div>
            <NFTGrid nfts={displayNfts} loading={loading} />
        </div>
    );
}
