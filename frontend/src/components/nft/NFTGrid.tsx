'use client';

import type { NFTWithListing } from '@/types';
import NFTCard from './NFTCard';

interface NFTGridProps {
    nfts: NFTWithListing[];
    loading?: boolean;
}

export default function NFTGrid({ nfts, loading }: NFTGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="bg-os-card border border-os-border rounded-2xl overflow-hidden animate-pulse">
                        <div className="aspect-square bg-os-surface" />
                        <div className="p-4 space-y-2">
                            <div className="h-3 bg-os-surface rounded w-16" />
                            <div className="h-4 bg-os-surface rounded w-24" />
                            <div className="h-3 bg-os-surface rounded w-20 mt-3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (nfts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-os-text-secondary">
                <svg className="w-16 h-16 opacity-30 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                </svg>
                <p className="text-lg font-medium">No NFTs found</p>
                <p className="text-sm mt-1">Mint your first NFT to get started!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {nfts.map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
            ))}
        </div>
    );
}
