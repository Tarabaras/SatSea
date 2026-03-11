import { u256 } from '@btc-vision/as-bignum/assembly';
import {
    OP_NET,
    Blockchain,
    Address,
    Calldata,
    BytesWriter,
    StoredU256,
    StoredU256Array,
    StoredAddressArray,
    SafeMath,
    Revert,
    EMPTY_POINTER,
} from '@btc-vision/btc-runtime/runtime';

/**
 * SatSea — NFT Marketplace on Bitcoin L1
 *
 * Minimal NFT marketplace on OP_NET.
 * Supports minting, listing, buying, and cancelling NFTs.
 *
 * Storage Layout (arrays indexed by tokenId):
 *   - owners: StoredAddressArray (owner of each NFT)
 *   - metadataIds: StoredU256Array (metadata identifier per NFT)
 *   - listingPrices: StoredU256Array (listing price, 0 if not listed)
 *   - listingActives: StoredU256Array (1 = listed, 0 = not)
 *   - sellers: StoredAddressArray (seller address when listed)
 */

const ZERO: u256 = u256.Zero;
const ONE: u256 = u256.One;

@final
export class NFTMarketplace extends OP_NET {
    // ====== Global Storage ======
    private nextTokenIdPointer: u16 = Blockchain.nextPointer;
    private nextTokenIdStore: StoredU256 = new StoredU256(this.nextTokenIdPointer, EMPTY_POINTER);

    private totalListingsPointer: u16 = Blockchain.nextPointer;
    private totalListingsStore: StoredU256 = new StoredU256(this.totalListingsPointer, EMPTY_POINTER);

    // ====== Per-NFT Storage (arrays indexed by tokenId) ======
    private ownersPointer: u16 = Blockchain.nextPointer;
    private metadataIdsPointer: u16 = Blockchain.nextPointer;
    private listingPricesPointer: u16 = Blockchain.nextPointer;
    private listingActivesPointer: u16 = Blockchain.nextPointer;
    private sellersPointer: u16 = Blockchain.nextPointer;

    // Reserve additional pointers for array internal storage
    private _r01: u16 = Blockchain.nextPointer;
    private _r02: u16 = Blockchain.nextPointer;
    private _r03: u16 = Blockchain.nextPointer;
    private _r04: u16 = Blockchain.nextPointer;
    private _r05: u16 = Blockchain.nextPointer;
    private _r06: u16 = Blockchain.nextPointer;
    private _r07: u16 = Blockchain.nextPointer;
    private _r08: u16 = Blockchain.nextPointer;
    private _r09: u16 = Blockchain.nextPointer;
    private _r10: u16 = Blockchain.nextPointer;
    private _r11: u16 = Blockchain.nextPointer;
    private _r12: u16 = Blockchain.nextPointer;
    private _r13: u16 = Blockchain.nextPointer;
    private _r14: u16 = Blockchain.nextPointer;
    private _r15: u16 = Blockchain.nextPointer;
    private _r16: u16 = Blockchain.nextPointer;
    private _r17: u16 = Blockchain.nextPointer;
    private _r18: u16 = Blockchain.nextPointer;
    private _r19: u16 = Blockchain.nextPointer;
    private _r20: u16 = Blockchain.nextPointer;
    private _r21: u16 = Blockchain.nextPointer;
    private _r22: u16 = Blockchain.nextPointer;
    private _r23: u16 = Blockchain.nextPointer;
    private _r24: u16 = Blockchain.nextPointer;
    private _r25: u16 = Blockchain.nextPointer;
    private _r26: u16 = Blockchain.nextPointer;
    private _r27: u16 = Blockchain.nextPointer;
    private _r28: u16 = Blockchain.nextPointer;
    private _r29: u16 = Blockchain.nextPointer;
    private _r30: u16 = Blockchain.nextPointer;
    private _r31: u16 = Blockchain.nextPointer;
    private _r32: u16 = Blockchain.nextPointer;
    private _r33: u16 = Blockchain.nextPointer;
    private _r34: u16 = Blockchain.nextPointer;
    private _r35: u16 = Blockchain.nextPointer;
    private _r36: u16 = Blockchain.nextPointer;
    private _r37: u16 = Blockchain.nextPointer;
    private _r38: u16 = Blockchain.nextPointer;
    private _r39: u16 = Blockchain.nextPointer;
    private _r40: u16 = Blockchain.nextPointer;

    public constructor() {
        super();
    }

    public override onDeployment(_calldata: Calldata): void {
        this.nextTokenIdStore.value = ZERO;
        this.totalListingsStore.value = ZERO;
    }

    // ====== Array helpers ======

    private getOwners(): StoredAddressArray {
        return new StoredAddressArray(this.ownersPointer, EMPTY_POINTER);
    }

    private getMetadataIds(): StoredU256Array {
        return new StoredU256Array(this.metadataIdsPointer, EMPTY_POINTER);
    }

    private getListingPrices(): StoredU256Array {
        return new StoredU256Array(this.listingPricesPointer, EMPTY_POINTER);
    }

    private getListingActives(): StoredU256Array {
        return new StoredU256Array(this.listingActivesPointer, EMPTY_POINTER);
    }

    private getSellers(): StoredAddressArray {
        return new StoredAddressArray(this.sellersPointer, EMPTY_POINTER);
    }

    // ====== Write Methods ======

    /** Mint a new NFT. metadataId is a u256 representing off-chain metadata index/hash. */
    @method(
        { name: 'metadataId', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'tokenId', type: ABIDataTypes.UINT256 })
    public mintNFT(calldata: Calldata): BytesWriter {
        const metadataId = calldata.readU256();
        const sender: Address = Blockchain.tx.sender;

        const tokenId = this.nextTokenIdStore.value;

        // Push data to all arrays (index = tokenId)
        const owners = this.getOwners();
        owners.push(sender);
        owners.save();

        const metadataIds = this.getMetadataIds();
        metadataIds.push(metadataId);
        metadataIds.save();

        const prices = this.getListingPrices();
        prices.push(ZERO);
        prices.save();

        const actives = this.getListingActives();
        actives.push(ZERO);
        actives.save();

        const sellers = this.getSellers();
        sellers.push(sender);
        sellers.save();

        // Increment counter
        this.nextTokenIdStore.value = SafeMath.add(tokenId, ONE);

        const writer = new BytesWriter(32);
        writer.writeU256(tokenId);
        return writer;
    }

    /** List an NFT for sale at the given price (in satoshis). */
    @method(
        { name: 'tokenId', type: ABIDataTypes.UINT256 },
        { name: 'price', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public listNFT(calldata: Calldata): BytesWriter {
        const tokenIdRaw = calldata.readU256();
        const price = calldata.readU256();
        const tokenId = tokenIdRaw.toI32();
        const sender: Address = Blockchain.tx.sender;

        if (tokenId >= this.nextTokenIdStore.value.toI32()) throw new Revert('NFT does not exist');
        if (price == ZERO) throw new Revert('Price must be > 0');

        // Check ownership
        const owners = this.getOwners();
        const owner = owners.get(tokenId);
        if (!owner.equals(sender)) throw new Revert('Not the owner');

        // Check not already listed
        const actives = this.getListingActives();
        if (actives.get(tokenId) == ONE) throw new Revert('Already listed');

        // Set listing
        const prices = this.getListingPrices();
        prices.set(tokenId, price);
        prices.save();

        actives.set(tokenId, ONE);
        actives.save();

        const sellers = this.getSellers();
        sellers.set(tokenId, sender);
        sellers.save();

        // Increment total listings
        this.totalListingsStore.value = SafeMath.add(this.totalListingsStore.value, ONE);

        const writer = new BytesWriter(32);
        writer.writeBoolean(true);
        return writer;
    }

    /** Cancel a listing. Only the seller can cancel. */
    @method(
        { name: 'tokenId', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public cancelListing(calldata: Calldata): BytesWriter {
        const tokenIdRaw = calldata.readU256();
        const tokenId = tokenIdRaw.toI32();
        const sender: Address = Blockchain.tx.sender;

        if (tokenId >= this.nextTokenIdStore.value.toI32()) throw new Revert('NFT does not exist');

        const actives = this.getListingActives();
        if (actives.get(tokenId) != ONE) throw new Revert('Not listed');

        const sellers = this.getSellers();
        const seller = sellers.get(tokenId);
        if (!seller.equals(sender)) throw new Revert('Not the seller');

        // Deactivate listing
        actives.set(tokenId, ZERO);
        actives.save();

        const prices = this.getListingPrices();
        prices.set(tokenId, ZERO);
        prices.save();

        // Decrement total listings
        if (u256.gt(this.totalListingsStore.value, ZERO)) {
            this.totalListingsStore.value = SafeMath.sub(this.totalListingsStore.value, ONE);
        }

        const writer = new BytesWriter(32);
        writer.writeBoolean(true);
        return writer;
    }

    /** Buy a listed NFT. Transfers ownership to buyer. */
    @method(
        { name: 'tokenId', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public buyNFT(calldata: Calldata): BytesWriter {
        const tokenIdRaw = calldata.readU256();
        const tokenId = tokenIdRaw.toI32();
        const buyer: Address = Blockchain.tx.sender;

        if (tokenId >= this.nextTokenIdStore.value.toI32()) throw new Revert('NFT does not exist');

        const actives = this.getListingActives();
        if (actives.get(tokenId) != ONE) throw new Revert('Not listed for sale');

        const sellers = this.getSellers();
        const seller = sellers.get(tokenId);

        // Buyer cannot be seller
        if (seller.equals(buyer)) throw new Revert('Cannot buy your own NFT');

        // Transfer ownership
        const owners = this.getOwners();
        owners.set(tokenId, buyer);
        owners.save();

        // Deactivate listing
        actives.set(tokenId, ZERO);
        actives.save();

        const prices = this.getListingPrices();
        prices.set(tokenId, ZERO);
        prices.save();

        // Decrement total listings
        if (u256.gt(this.totalListingsStore.value, ZERO)) {
            this.totalListingsStore.value = SafeMath.sub(this.totalListingsStore.value, ONE);
        }

        const writer = new BytesWriter(32);
        writer.writeBoolean(true);
        return writer;
    }

    // ====== Read Methods ======

    /** Get total number of minted NFTs */
    @method()
    @returns({ name: 'nextTokenId', type: ABIDataTypes.UINT256 })
    public getNextTokenId(calldata: Calldata): BytesWriter {
        const writer = new BytesWriter(32);
        writer.writeU256(this.nextTokenIdStore.value);
        return writer;
    }

    /** Get NFT info: owner (as u256) + metadataId */
    @method(
        { name: 'tokenId', type: ABIDataTypes.UINT256 },
    )
    @returns(
        { name: 'owner', type: ABIDataTypes.UINT256 },
        { name: 'metadataId', type: ABIDataTypes.UINT256 },
    )
    public getNFT(calldata: Calldata): BytesWriter {
        const tokenIdRaw = calldata.readU256();
        const tokenId = tokenIdRaw.toI32();

        if (tokenId >= this.nextTokenIdStore.value.toI32()) throw new Revert('NFT does not exist');

        const owners = this.getOwners();
        const owner = owners.get(tokenId);

        const metadataIds = this.getMetadataIds();
        const metadataId = metadataIds.get(tokenId);

        const writer = new BytesWriter(64);
        writer.writeAddress(owner);
        writer.writeU256(metadataId);
        return writer;
    }

    /** Get listing info: price + active flag */
    @method(
        { name: 'tokenId', type: ABIDataTypes.UINT256 },
    )
    @returns(
        { name: 'price', type: ABIDataTypes.UINT256 },
        { name: 'active', type: ABIDataTypes.BOOL },
        { name: 'seller', type: ABIDataTypes.UINT256 },
    )
    public getListing(calldata: Calldata): BytesWriter {
        const tokenIdRaw = calldata.readU256();
        const tokenId = tokenIdRaw.toI32();

        if (tokenId >= this.nextTokenIdStore.value.toI32()) throw new Revert('NFT does not exist');

        const prices = this.getListingPrices();
        const actives = this.getListingActives();
        const sellers = this.getSellers();

        const writer = new BytesWriter(96);
        writer.writeU256(prices.get(tokenId));
        writer.writeBoolean(actives.get(tokenId) == ONE);
        writer.writeAddress(sellers.get(tokenId));
        return writer;
    }

    /** Get total active listings count */
    @method()
    @returns({ name: 'count', type: ABIDataTypes.UINT256 })
    public getTotalListings(calldata: Calldata): BytesWriter {
        const writer = new BytesWriter(32);
        writer.writeU256(this.totalListingsStore.value);
        return writer;
    }
}
