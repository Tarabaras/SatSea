import { ABIDataTypes, BitcoinAbiTypes, getContract, type CallResult, type BaseContractProperties, type BitcoinInterfaceAbi } from 'opnet';
import { Address } from '@btc-vision/transaction';

export const NFT_MARKETPLACE_ABI: BitcoinInterfaceAbi = [
    // Write methods
    {
        name: 'mintNFT',
        inputs: [{ name: 'metadataId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'tokenId', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'listNFT',
        inputs: [
            { name: 'tokenId', type: ABIDataTypes.UINT256 },
            { name: 'price', type: ABIDataTypes.UINT256 },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'cancelListing',
        inputs: [{ name: 'tokenId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'buyNFT',
        inputs: [{ name: 'tokenId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    // Read methods
    {
        name: 'getNextTokenId',
        constant: true,
        inputs: [],
        outputs: [{ name: 'nextTokenId', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getNFT',
        constant: true,
        inputs: [{ name: 'tokenId', type: ABIDataTypes.UINT256 }],
        outputs: [
            { name: 'owner', type: ABIDataTypes.UINT256 },
            { name: 'metadataId', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getListing',
        constant: true,
        inputs: [{ name: 'tokenId', type: ABIDataTypes.UINT256 }],
        outputs: [
            { name: 'price', type: ABIDataTypes.UINT256 },
            { name: 'active', type: ABIDataTypes.BOOL },
            { name: 'seller', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getTotalListings',
        constant: true,
        inputs: [],
        outputs: [{ name: 'count', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
];

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
export const DEFAULT_FEE_RATE = 10;
export const MAX_SAT_PER_TX = BigInt(100000);

export interface INFTMarketplaceContract extends BaseContractProperties {
    mintNFT(metadataId: bigint): Promise<CallResult>;
    listNFT(tokenId: bigint, price: bigint): Promise<CallResult>;
    cancelListing(tokenId: bigint): Promise<CallResult>;
    buyNFT(tokenId: bigint): Promise<CallResult>;
    getNextTokenId(): Promise<CallResult>;
    getNFT(tokenId: bigint): Promise<CallResult>;
    getListing(tokenId: bigint): Promise<CallResult>;
    getTotalListings(): Promise<CallResult>;
}

export function getNFTMarketplaceContract(provider: any, network: any, senderPubKey?: string): INFTMarketplaceContract {
    if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env');
    }

    let senderAddress: Address | undefined;
    if (senderPubKey) {
        try {
            senderAddress = Address.fromString(senderPubKey);
        } catch {
            senderAddress = undefined;
        }
    }

    return getContract<INFTMarketplaceContract>(
        CONTRACT_ADDRESS,
        NFT_MARKETPLACE_ABI,
        provider,
        network,
        senderAddress,
    );
}
