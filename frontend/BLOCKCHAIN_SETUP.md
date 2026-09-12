# MeasureSure Blockchain Integration

The frontend now supports real certificate anchoring and public blockchain verification.

## Architecture

Inspection -> Certificate -> SHA-256 certificate fingerprint -> CertificateRegistry smart contract -> Public verification

Only fingerprints and certificate lifecycle metadata are stored on-chain. The certificate/business data stays off-chain.

## 1. Deploy the contract

Open `contracts/CertificateRegistry.sol` in Remix and compile it with Solidity `0.8.20` or newer within the `0.8.x` range.

For an SIH demo, use an EVM test network such as Sepolia. Connect Remix to MetaMask, deploy `CertificateRegistry`, and copy the deployed contract address.

The deploying wallet becomes the contract owner and is automatically authorized as an issuer.

If another inspector wallet must issue certificates, call:

`setIssuer(inspectorWallet, true)`

from the owner account.

## 2. Configure the frontend

Copy `.env.example` to `.env.local` and set:

- `VITE_BLOCKCHAIN_CHAIN_ID`
- `VITE_BLOCKCHAIN_CHAIN_NAME`
- `VITE_BLOCKCHAIN_RPC_URL`
- `VITE_BLOCKCHAIN_CONTRACT_ADDRESS`
- `VITE_BLOCKCHAIN_EXPLORER_URL`

Do not put private keys or seed phrases in the frontend.

## 3. Install dependencies and run

```bash
npm install
npm run dev
```

The project uses `ethers` for wallet and smart-contract interaction.

## 4. Certificate workflow

1. Complete an inspection.
2. Open its certificate.
3. Click **Anchor on blockchain**.
4. MetaMask asks the authorized issuer wallet to sign the transaction.
5. After confirmation, the certificate receives a real transaction hash.
6. The certificate page can then run **Verify on blockchain**.
7. `/verify/:certificateId` provides a public verification page without requiring login.

## 5. What is hashed

A deterministic JSON representation of the certificate and its instrument information is SHA-256 hashed. The hash is what proves that the off-chain certificate record has not changed.

If any hashed field changes after anchoring, blockchain verification fails.

## Important

The supplied project is currently an in-memory frontend demo (`mockStore.js`). This integration therefore anchors the certificate data currently available in the frontend. When your friend's real backend is connected, the same `blockchainService.js` should be called by the backend at certificate issuance time, with the backend persisting the transaction hash and blockchain status in the database. Do not keep an issuer private key in the browser for a production deployment.
