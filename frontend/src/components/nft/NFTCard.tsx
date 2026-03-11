'use client';

import Link from 'next/link';
import type { NFTWithListing } from '@/types';
import { formatBTCShort } from '@/services/wallet';

interface NFTCardProps {
    nft: NFTWithListing;
}

export default function NFTCard({ nft }: NFTCardProps) {
    const isListed = nft.listing?.active;
    const price = nft.listing?.price || 0;

    return (
        <Link href={`/nft/${nft.id}`}>
            <div className="group bg-os-card border border-os-border rounded-2xl overflow-hidden hover:border-os-border-light hover:shadow-xl hover:shadow-black/20 transition-all duration-200 cursor-pointer">
                {/* Image */}
                <div className="aspect-square overflow-hidden bg-os-surface relative">
                    <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {nft.isMock && (
                        <div className="absolute top-3 left-3 bg-os-orange/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            DEMO
                        </div>
                    )}
                    {isListed && (
                        <div className="absolute top-3 right-3 bg-os-blue/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                            For Sale
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-4">
                    {nft.collection && (
                        <p className="text-xs text-os-blue font-medium mb-1">{nft.collection}</p>
                    )}
                    <h3 className="text-sm font-semibold text-os-text truncate">{nft.name}</h3>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-os-border">
                        {isListed ? (
                            <div>
                                <p className="text-xs text-os-text-secondary">Price</p>
                                <p className="text-sm font-bold text-os-text flex items-center gap-1">
                                    <span className="text-os-orange">₿</span>
                                    {formatBTCShort(price)}
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-xs text-os-text-secondary">Not listed</p>
                            </div>
                        )}

                        {isListed && (
                            <button className="bg-os-blue hover:bg-os-blue-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                                Buy
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
