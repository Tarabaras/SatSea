'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/components/providers/WalletProvider';
import { MOCK_NFTS } from '@/lib/mock-data';
import { getNFTOnChain, getListingOnChain, buyNFTOnChain, listNFTOnChain, cancelListingOnChain } from '@/lib/opnet';
import { formatBTCShort, formatAddress } from '@/services/wallet';
import type { NFTWithListing } from '@/types';

export default function NFTDetailPage() {
    const params = useParams();
    const id = Number(params.id);
    const { walletAddress, opnetConfig } = useWallet();

    const [nft, setNft] = useState<NFTWithListing | null>(null);
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState<'idle' | 'buying' | 'listing' | 'cancelling'>('idle');
    const [listPrice, setListPrice] = useState('');
    const [showListForm, setShowListForm] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const loadNFT = async () => {
        setLoading(true);
        // Try on-chain
        if (opnetConfig.provider) {
            try {
                const nftData = await getNFTOnChain(opnetConfig, id);
                const listing = await getListingOnChain(opnetConfig, id);
                if (nftData) {
                    setNft({
                        id, name: `SatSea #${id}`, description: `NFT #${id} on Bitcoin L1`,
                        image: `https://picsum.photos/seed/nft${id}/600/600`,
                        owner: nftData.owner, metadataId: nftData.metadataId,
                        listing: listing || undefined,
                        isMock: false,
                    });
                    setLoading(false);
                    return;
                }
            } catch {}
        }
        // Fallback to mock
        const mock = MOCK_NFTS.find((n) => n.id === id);
        setNft(mock ? { ...mock, isMock: true } : null);
        setLoading(false);
    };

    useEffect(() => { loadNFT(); }, [id, opnetConfig.provider]);

    const handleBuy = async () => {
        if (!nft) return;
        setAction('buying');
        setStatus(null);
        try {
            const txId = await buyNFTOnChain(opnetConfig, nft.id);
            setStatus({ type: 'success', message: `Purchase successful! TX: ${txId}` });
            await loadNFT();
        } catch (e: any) {
            setStatus({ type: 'error', message: e?.message || 'Purchase failed' });
        } finally {
            setAction('idle');
        }
    };

    const handleList = async () => {
        if (!nft || !listPrice) return;
        setAction('listing');
        setStatus(null);
        try {
            const priceSats = BigInt(Math.round(parseFloat(listPrice) * 1e8));
            const txId = await listNFTOnChain(opnetConfig, nft.id, priceSats);
            setStatus({ type: 'success', message: `Listed! TX: ${txId}` });
            setShowListForm(false);
            setListPrice('');
            await loadNFT();
        } catch (e: any) {
            setStatus({ type: 'error', message: e?.message || 'Listing failed' });
        } finally {
            setAction('idle');
        }
    };

    const handleCancel = async () => {
        if (!nft) return;
        setAction('cancelling');
        setStatus(null);
        try {
            const txId = await cancelListingOnChain(opnetConfig, nft.id);
            setStatus({ type: 'success', message: `Cancelled! TX: ${txId}` });
            await loadNFT();
        } catch (e: any) {
            setStatus({ type: 'error', message: e?.message || 'Cancel failed' });
        } finally {
            setAction('idle');
        }
    };

    if (loading) {
        return (
            <div className="nft-detail-grid">
                <div className="nft-image-container animate-pulse"><div className="aspect-square bg-os-surface" /></div>
                <div className="space-y-4 animate-pulse">
                    <div className="h-6 bg-os-surface rounded w-32" />
                    <div className="h-10 bg-os-surface rounded w-48" />
                    <div className="h-4 bg-os-surface rounded w-full" />
                    <div className="h-20 bg-os-surface rounded" />
                </div>
            </div>
        );
    }

    if (!nft) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-os-text-secondary text-lg">NFT not found</p>
                <Link href="/" className="text-os-blue mt-4 text-sm">Back to Explore</Link>
            </div>
        );
    }

    const isListed = nft.listing?.active;
    const isOwner = walletAddress && nft.owner && (
        nft.owner === walletAddress || nft.owner.toLowerCase().includes(walletAddress.slice(-4).toLowerCase())
    );
    const btcPrice = 97500;

    return (
        <div className="nft-detail-grid">
            {/* Left: Image */}
            <div>
                <div className="nft-image-container">
                    <img src={nft.image} alt={nft.name} />
                </div>
            </div>

            {/* Right: Info */}
            <div>
                <div className="nft-info-card">
                    {nft.collection && <div className="collection-badge">{nft.collection}</div>}
                    <h1>{nft.name}</h1>
                    <p className="description">{nft.description}</p>

                    <div className="owner-row">
                        Owned by <span className="addr">{formatAddress(nft.owner)}</span>
                    </div>

                    {/* Price / Actions */}
                    {isListed && nft.listing && (
                        <div className="price-box">
                            <div className="price-label">Current Price</div>
                            <div className="price-value">
                                <span className="btc-icon">₿</span>
                                {formatBTCShort(nft.listing.price)}
                            </div>
                            <div className="price-usd">
                                ≈ ${((nft.listing.price / 1e8) * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    )}

                    {status && (
                        <div className={status.type === 'success' ? 'status-success' : 'status-error'}>
                            {status.message}
                        </div>
                    )}

                    <div className="space-y-3">
                        {nft.isMock && (
                            <div className="bg-os-orange/10 border border-os-orange/30 text-os-orange rounded-xl px-4 py-3 text-sm">
                                Demo NFT — mint a real NFT on the <Link href="/create" className="underline font-semibold">Create</Link> page to buy/sell on-chain.
                            </div>
                        )}

                        {!nft.isMock && isListed && !isOwner && (
                            <button onClick={handleBuy} disabled={action !== 'idle' || !walletAddress} className="btn-primary">
                                {!walletAddress ? 'Connect Wallet' : action === 'buying' ? 'Buying...' : `Buy for ₿ ${formatBTCShort(nft.listing!.price)}`}
                            </button>
                        )}

                        {!nft.isMock && isListed && isOwner && (
                            <button onClick={handleCancel} disabled={action !== 'idle'} className="btn-danger">
                                {action === 'cancelling' ? 'Cancelling...' : 'Cancel Listing'}
                            </button>
                        )}

                        {!nft.isMock && !isListed && isOwner && !showListForm && (
                            <button onClick={() => setShowListForm(true)} className="btn-orange">
                                List for Sale
                            </button>
                        )}

                        {!nft.isMock && showListForm && (
                            <div className="space-y-3">
                                <div className="form-group !mb-0">
                                    <label>Price (BTC)</label>
                                    <input
                                        type="text"
                                        value={listPrice}
                                        onChange={(e) => setListPrice(e.target.value)}
                                        placeholder="0.05"
                                        className="form-input"
                                    />
                                </div>
                                <button onClick={handleList} disabled={action !== 'idle' || !listPrice} className="btn-orange">
                                    {action === 'listing' ? 'Listing...' : 'Confirm Listing'}
                                </button>
                                <button onClick={() => setShowListForm(false)} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="nft-info-card mt-4">
                    <h3 className="text-sm font-bold mb-3">Details</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-os-text-secondary">Token ID</span>
                            <span className="font-mono">#{nft.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-os-text-secondary">Metadata ID</span>
                            <span className="font-mono">{nft.metadataId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-os-text-secondary">Blockchain</span>
                            <span className="text-os-orange">Bitcoin L1 (OP_NET)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
