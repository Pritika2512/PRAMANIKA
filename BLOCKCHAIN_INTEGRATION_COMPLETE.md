# Blockchain integration completed

Implemented in this MeasureSure SIH26036 project:

- `contracts/CertificateRegistry.sol` — EVM smart contract for certificate anchoring, public verification and revocation.
- `src/services/blockchainService.js` — wallet connection, SHA-256 certificate fingerprinting, on-chain registration and read-only verification.
- `src/config/blockchainConfig.js` — environment-based blockchain configuration.
- `src/pages/verification/PublicCertificateVerification.jsx` — public `/verify/:id` verification page.
- Certificate details now supports **Anchor on blockchain** and **Verify on blockchain**.
- Transaction hash and block-explorer link are shown after anchoring.
- Existing mock certificates no longer claim fake blockchain confirmations; they are marked `PENDING` until actually anchored.
- `.env.example` and `BLOCKCHAIN_SETUP.md` explain deployment/configuration.

The project still uses its current in-memory mock data layer. The blockchain layer is real and uses MetaMask + an EVM contract once the contract is deployed and `.env.local` is configured.
