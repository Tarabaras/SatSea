import type { NFTWithListing, Collection } from '@/types';

export const MOCK_NFTS: NFTWithListing[] = [
    {
        id: 0, name: 'Bitcoin Punk #001', description: 'OG Bitcoin Punk — first of its kind on L1.', image: 'https://picsum.photos/seed/btcpunk1/400/400',
        owner: 'bc1q...7x8f', metadataId: 0, collection: 'Bitcoin Punks',
        listing: { tokenId: 0, seller: 'bc1q...7x8f', price: 5000000, active: true },
    },
    {
        id: 1, name: 'Satoshi Cat #42', description: 'Rare Satoshi Cat with laser eyes.', image: 'https://picsum.photos/seed/satcat42/400/400',
        owner: 'bc1q...3k2m', metadataId: 1, collection: 'Satoshi Cats',
        listing: { tokenId: 1, seller: 'bc1q...3k2m', price: 3500000, active: true },
    },
    {
        id: 2, name: 'OP Ape #007', description: 'Diamond hands ape. Will never sell.', image: 'https://picsum.photos/seed/opape7/400/400',
        owner: 'bc1q...9p4q', metadataId: 2, collection: 'OP Apes',
        listing: { tokenId: 2, seller: 'bc1q...9p4q', price: 12000000, active: true },
    },
    {
        id: 3, name: 'Block Art #128', description: 'Generative art from Bitcoin block 128.', image: 'https://picsum.photos/seed/blockart128/400/400',
        owner: 'bc1q...a2b3', metadataId: 3, collection: 'Block Art',
    },
    {
        id: 4, name: 'Rune Stone #5', description: 'Ancient rune inscribed on Bitcoin.', image: 'https://picsum.photos/seed/rune5/400/400',
        owner: 'bc1q...c4d5', metadataId: 4, collection: 'Rune Stones',
        listing: { tokenId: 4, seller: 'bc1q...c4d5', price: 8500000, active: true },
    },
    {
        id: 5, name: 'Pixel Wizard #33', description: 'Magical pixel wizard casting spells.', image: 'https://picsum.photos/seed/wizard33/400/400',
        owner: 'bc1q...e6f7', metadataId: 5, collection: 'Pixel Wizards',
        listing: { tokenId: 5, seller: 'bc1q...e6f7', price: 2200000, active: true },
    },
    {
        id: 6, name: 'Ordinal Bear #88', description: 'Grizzly bear ordinal on Bitcoin.', image: 'https://picsum.photos/seed/bear88/400/400',
        owner: 'bc1q...g8h9', metadataId: 6, collection: 'Ordinal Bears',
    },
    {
        id: 7, name: 'Neon Skull #13', description: 'Cyberpunk neon skull. 1/1 edition.', image: 'https://picsum.photos/seed/skull13/400/400',
        owner: 'bc1q...i0j1', metadataId: 7, collection: 'Neon Skulls',
        listing: { tokenId: 7, seller: 'bc1q...i0j1', price: 15000000, active: true },
    },
    {
        id: 8, name: 'Bitcoin Punk #002', description: 'Second-gen Bitcoin Punk with mohawk.', image: 'https://picsum.photos/seed/btcpunk2/400/400',
        owner: 'bc1q...k2l3', metadataId: 8, collection: 'Bitcoin Punks',
        listing: { tokenId: 8, seller: 'bc1q...k2l3', price: 4500000, active: true },
    },
    {
        id: 9, name: 'Satoshi Cat #99', description: 'Golden Satoshi Cat. Extremely rare.', image: 'https://picsum.photos/seed/satcat99/400/400',
        owner: 'bc1q...m4n5', metadataId: 9, collection: 'Satoshi Cats',
    },
    {
        id: 10, name: 'OP Ape #042', description: 'Space helmet ape exploring Bitcoin.', image: 'https://picsum.photos/seed/opape42/400/400',
        owner: 'bc1q...o6p7', metadataId: 10, collection: 'OP Apes',
        listing: { tokenId: 10, seller: 'bc1q...o6p7', price: 9800000, active: true },
    },
    {
        id: 11, name: 'Block Art #256', description: 'Algorithmic art from block 256.', image: 'https://picsum.photos/seed/blockart256/400/400',
        owner: 'bc1q...q8r9', metadataId: 11, collection: 'Block Art',
        listing: { tokenId: 11, seller: 'bc1q...q8r9', price: 6700000, active: true },
    },
];

export const MOCK_COLLECTIONS: Collection[] = [
    { name: 'Bitcoin Punks', image: 'https://picsum.photos/seed/col-punks/100/100', floor: 4500000, volume: 250000000, items: 100, change: 12.5 },
    { name: 'Satoshi Cats', image: 'https://picsum.photos/seed/col-cats/100/100', floor: 3500000, volume: 180000000, items: 50, change: -3.2 },
    { name: 'OP Apes', image: 'https://picsum.photos/seed/col-apes/100/100', floor: 9800000, volume: 420000000, items: 200, change: 8.7 },
    { name: 'Block Art', image: 'https://picsum.photos/seed/col-art/100/100', floor: 6700000, volume: 150000000, items: 75, change: 25.3 },
    { name: 'Rune Stones', image: 'https://picsum.photos/seed/col-runes/100/100', floor: 8500000, volume: 310000000, items: 30, change: -1.8 },
    { name: 'Pixel Wizards', image: 'https://picsum.photos/seed/col-wiz/100/100', floor: 2200000, volume: 90000000, items: 150, change: 45.2 },
    { name: 'Neon Skulls', image: 'https://picsum.photos/seed/col-skulls/100/100', floor: 15000000, volume: 560000000, items: 25, change: 5.0 },
    { name: 'Ordinal Bears', image: 'https://picsum.photos/seed/col-bears/100/100', floor: 7200000, volume: 200000000, items: 80, change: -8.5 },
];
