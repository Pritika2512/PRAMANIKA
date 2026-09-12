export const blockchainConfig = {
  // Configure these values in .env.local after deploying CertificateRegistry.
  // Sepolia is the recommended SIH demo network.
  chainId: Number(import.meta.env.VITE_BLOCKCHAIN_CHAIN_ID || 11155111),
  chainName: import.meta.env.VITE_BLOCKCHAIN_CHAIN_NAME || "Sepolia",
  rpcUrl: import.meta.env.VITE_BLOCKCHAIN_RPC_URL || "",
  contractAddress: import.meta.env.VITE_BLOCKCHAIN_CONTRACT_ADDRESS || "",
  explorerUrl:
    import.meta.env.VITE_BLOCKCHAIN_EXPLORER_URL ||
    "https://sepolia.etherscan.io",
};

export const blockchainConfigured =
  Boolean(blockchainConfig.contractAddress) &&
  /^0x[a-fA-F0-9]{40}$/.test(blockchainConfig.contractAddress);
