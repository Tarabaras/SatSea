import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const NFTMarketplaceEvents = [];

export const NFTMarketplaceAbi = [
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
    {
        name: 'getNextTokenId',
        inputs: [],
        outputs: [{ name: 'nextTokenId', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getNFT',
        inputs: [{ name: 'tokenId', type: ABIDataTypes.UINT256 }],
        outputs: [
            { name: 'owner', type: ABIDataTypes.UINT256 },
            { name: 'metadataId', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getListing',
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
        inputs: [],
        outputs: [{ name: 'count', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    ...NFTMarketplaceEvents,
    ...OP_NET_ABI,
];

export default NFTMarketplaceAbi;
