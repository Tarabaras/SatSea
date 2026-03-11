import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the mintNFT function call.
 */
export type MintNFT = CallResult<
    {
        tokenId: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the listNFT function call.
 */
export type ListNFT = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the cancelListing function call.
 */
export type CancelListing = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the buyNFT function call.
 */
export type BuyNFT = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getNextTokenId function call.
 */
export type GetNextTokenId = CallResult<
    {
        nextTokenId: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getNFT function call.
 */
export type GetNFT = CallResult<
    {
        owner: bigint;
        metadataId: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getListing function call.
 */
export type GetListing = CallResult<
    {
        price: bigint;
        active: boolean;
        seller: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getTotalListings function call.
 */
export type GetTotalListings = CallResult<
    {
        count: bigint;
    },
    OPNetEvent<never>[]
>;

// ------------------------------------------------------------------
// INFTMarketplace
// ------------------------------------------------------------------
export interface INFTMarketplace extends IOP_NETContract {
    mintNFT(metadataId: bigint): Promise<MintNFT>;
    listNFT(tokenId: bigint, price: bigint): Promise<ListNFT>;
    cancelListing(tokenId: bigint): Promise<CancelListing>;
    buyNFT(tokenId: bigint): Promise<BuyNFT>;
    getNextTokenId(): Promise<GetNextTokenId>;
    getNFT(tokenId: bigint): Promise<GetNFT>;
    getListing(tokenId: bigint): Promise<GetListing>;
    getTotalListings(): Promise<GetTotalListings>;
}
