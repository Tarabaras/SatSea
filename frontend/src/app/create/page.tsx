'use client';

import { useState } from 'react';
import { useWallet } from '@/components/providers/WalletProvider';
import { mintNFTOnChain } from '@/lib/opnet';

export default function CreatePage() {
    const { walletAddress, opnetConfig } = useWallet();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [minting, setMinting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleMint = async () => {
        if (!walletAddress) return;
        if (!name.trim()) { setStatus({ type: 'error', message: 'Please enter a name' }); return; }

        setMinting(true);
        setStatus(null);

        try {
            // metadataId is a simple counter/hash for MVP
            const metadataId = Date.now() % 1000000;
            const txId = await mintNFTOnChain(opnetConfig, metadataId);
            setStatus({ type: 'success', message: `NFT minted! TX: ${txId}` });
            setName('');
            setDescription('');
            setImageUrl('');
        } catch (e: any) {
            setStatus({ type: 'error', message: e?.message || 'Minting failed' });
        } finally {
            setMinting(false);
        }
    };

    return (
        <div className="create-page">
            <h1 className="text-2xl font-extrabold mb-2">Create NFT</h1>
            <p className="text-os-text-secondary text-sm mb-6">
                Mint a new NFT on Bitcoin Layer 1 via OP_NET
            </p>

            <div className="create-card">
                {/* Image preview */}
                <div className="form-group">
                    <label>Image URL</label>
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/nft.png"
                        className="form-input"
                    />
                    <p className="form-hint">Enter a URL to your NFT image</p>
                </div>

                {imageUrl && (
                    <div className="mb-6 rounded-xl overflow-hidden border border-os-border aspect-square max-w-[300px]">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="My Awesome NFT"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="A short description of your NFT..."
                        className="form-input"
                        rows={3}
                    />
                </div>

                {status && (
                    <div className={status.type === 'success' ? 'status-success' : 'status-error'}>
                        {status.message}
                    </div>
                )}

                <button
                    onClick={handleMint}
                    disabled={minting || !walletAddress || !name.trim()}
                    className="btn-orange"
                >
                    {!walletAddress
                        ? 'Connect Wallet First'
                        : minting
                        ? 'Minting...'
                        : 'Mint NFT'
                    }
                </button>
            </div>
        </div>
    );
}
