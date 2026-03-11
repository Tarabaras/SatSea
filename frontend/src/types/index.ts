export interface NFTItem {
    id: number;
    name: string;
    description: string;
    image: string;
    owner: string;
    metadataId: number;
    collection?: string;
}

export interface Listing {
    tokenId: number;
    seller: string;
    price: number; // satoshis
    active: boolean;
}

export interface NFTWithListing extends NFTItem {
    listing?: Listing;
    isMock?: boolean;
}

export interface Collection {
    name: string;
    image: string;
    floor: number; // satoshis
    volume: number; // satoshis
    items: number;
    change: number; // percent
}
