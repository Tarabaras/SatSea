# SatSea — NFT Marketplace on Bitcoin L1

A decentralized NFT marketplace built on Bitcoin Layer 1 using OP_NET.

## Quick Start

### Install
```bash
npm run install:all
```

### Build Contract
```bash
npm run build:contract
```

### Deploy Contract
Deploy to OP_NET Testnet using OP_WALLET browser extension.

### Run Frontend
```bash
npm run dev
```

Open http://localhost:3000

## Architecture

- **Smart Contract**: AssemblyScript → WASM (OP_NET runtime)
- **Frontend**: Next.js + TypeScript + TailwindCSS
- **Wallet**: OP_WALLET browser extension

## Contract Methods

| Method | Type | Description |
|--------|------|-------------|
| mintNFT(metadataId) | write | Mint a new NFT |
| listNFT(tokenId, price) | write | List NFT for sale |
| cancelListing(tokenId) | write | Cancel listing |
| buyNFT(tokenId) | write | Buy listed NFT |
| getNFT(tokenId) | read | Get NFT info |
| getListing(tokenId) | read | Get listing info |
| getNextTokenId() | read | Get total NFTs minted |
