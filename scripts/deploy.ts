import { CONFIG } from './config';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    console.log('=== SatSea NFT Marketplace Deployment ===');
    console.log(`Network: ${CONFIG.network}`);
    console.log(`RPC: ${CONFIG.rpc}`);

    const wasmPath = path.resolve(__dirname, CONFIG.wasmPath);

    if (!fs.existsSync(wasmPath)) {
        console.error(`WASM not found: ${wasmPath}`);
        console.log('Run: cd contracts && npm run build');
        process.exit(1);
    }

    const wasm = fs.readFileSync(wasmPath);
    console.log(`Contract WASM: ${(wasm.length / 1024).toFixed(1)} KB`);
    console.log('');
    console.log('Deploy via OP_WALLET browser extension:');
    console.log('1. Open OP_WALLET');
    console.log('2. Go to Deploy Contract');
    console.log(`3. Select ${wasmPath}`);
    console.log('4. Confirm transaction');
    console.log('');
    console.log('After deployment, add the contract address to:');
    console.log('  frontend/.env → NEXT_PUBLIC_CONTRACT_ADDRESS=0x...');
}

main().catch(console.error);
