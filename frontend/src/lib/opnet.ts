import { getNFTMarketplaceContract, CONTRACT_ADDRESS, DEFAULT_FEE_RATE, MAX_SAT_PER_TX } from '@/services/contract';
import type { NFTWithListing, Listing } from '@/types';

export interface OpnetConfig {
    provider: any;
    network: any;
    publicKey?: string;
    signer?: any;
    walletAddress?: string;
}

function getContract(config: OpnetConfig) {
    return getNFTMarketplaceContract(config.provider, config.network, config.publicKey);
}

async function sendTx(config: OpnetConfig, simulation: any) {
    if (!config.signer) throw new Error('Wallet signer not available. Reconnect wallet.');
    return await simulation.sendTransaction({
        signer: config.signer,
        refundTo: config.walletAddress,
        maximumAllowedSatToSpend: MAX_SAT_PER_TX,
        feeRate: DEFAULT_FEE_RATE,
        network: config.network,
    } as any);
}

// ──────── Read Functions ────────

export async function getNextTokenId(config: OpnetConfig): Promise<number> {
    if (!CONTRACT_ADDRESS || !config.provider) return 0;
    try {
        const contract = getContract(config);
        const result = await contract.getNextTokenId();
        const props = result?.properties as any;
        return Number(props?.nextTokenId?.toString() || '0');
    } catch (e) {
        console.error('getNextTokenId error:', e);
        return 0;
    }
}

export async function getNFTOnChain(config: OpnetConfig, tokenId: number): Promise<{ owner: string; metadataId: number } | null> {
    if (!CONTRACT_ADDRESS || !config.provider) return null;
    try {
        const contract = getContract(config);
        const result = await contract.getNFT(BigInt(tokenId));
        const props = result?.properties as any;
        return {
            owner: props?.owner?.toString() || '0',
            metadataId: Number(props?.metadataId?.toString() || '0'),
        };
    } catch (e) {
        console.error(`getNFT(${tokenId}) error:`, e);
        return null;
    }
}

export async function getListingOnChain(config: OpnetConfig, tokenId: number): Promise<Listing | null> {
    if (!CONTRACT_ADDRESS || !config.provider) return null;
    try {
        const contract = getContract(config);
        const result = await contract.getListing(BigInt(tokenId));
        const props = result?.properties as any;
        return {
            tokenId,
            price: Number(props?.price?.toString() || '0'),
            active: props?.active === true || props?.active?.toString() === 'true',
            seller: props?.seller?.toString() || '0',
        };
    } catch (e) {
        console.error(`getListing(${tokenId}) error:`, e);
        return null;
    }
}

export async function getAllNFTs(config: OpnetConfig): Promise<NFTWithListing[]> {
    const nfts: NFTWithListing[] = [];
    const total = await getNextTokenId(config);

    for (let i = 0; i < total; i++) {
        const nftData = await getNFTOnChain(config, i);
        const listing = await getListingOnChain(config, i);

        if (nftData) {
            nfts.push({
                id: i,
                name: `SatSea #${i}`,
                description: `NFT #${i} on Bitcoin L1`,
                image: `/nfts/${(i % 8) + 1}.png`,
                owner: nftData.owner,
                metadataId: nftData.metadataId,
                listing: listing || undefined,
            });
        }
    }
    return nfts;
}

// ──────── Write Functions ────────

export async function mintNFTOnChain(config: OpnetConfig, metadataId: number): Promise<string> {
    const contract = getContract(config);
    const sim = await contract.mintNFT(BigInt(metadataId));
    if ('revert' in sim && (sim as any).revert) throw new Error((sim as any).revert);
    if ((sim as any).error) throw new Error((sim as any).error);
    const tx = await sendTx(config, sim);
    return tx?.transactionId || tx?.toString() || 'sent';
}

export async function listNFTOnChain(config: OpnetConfig, tokenId: number, priceSats: bigint): Promise<string> {
    const contract = getContract(config);
    const sim = await contract.listNFT(BigInt(tokenId), priceSats);
    if ('revert' in sim && (sim as any).revert) throw new Error((sim as any).revert);
    if ((sim as any).error) throw new Error((sim as any).error);
    const tx = await sendTx(config, sim);
    return tx?.transactionId || tx?.toString() || 'sent';
}

export async function cancelListingOnChain(config: OpnetConfig, tokenId: number): Promise<string> {
    const contract = getContract(config);
    const sim = await contract.cancelListing(BigInt(tokenId));
    if ('revert' in sim && (sim as any).revert) throw new Error((sim as any).revert);
    if ((sim as any).error) throw new Error((sim as any).error);
    const tx = await sendTx(config, sim);
    return tx?.transactionId || tx?.toString() || 'sent';
}

export async function buyNFTOnChain(config: OpnetConfig, tokenId: number): Promise<string> {
    const contract = getContract(config);
    const sim = await contract.buyNFT(BigInt(tokenId));
    if ('revert' in sim && (sim as any).revert) throw new Error((sim as any).revert);
    if ((sim as any).error) throw new Error((sim as any).error);
    const tx = await sendTx(config, sim);
    return tx?.transactionId || tx?.toString() || 'sent';
}
