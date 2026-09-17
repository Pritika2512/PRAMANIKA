import {
  BrowserProvider,
  Contract,
  JsonRpcProvider,
  sha256,
  toUtf8Bytes,
} from "ethers";
import { blockchainConfig, blockchainConfigured } from "../config/blockchainConfig.js";

export const CERTIFICATE_REGISTRY_ABI = [
  "function registerCertificate(bytes32 certificateIdHash, bytes32 certificateHash, bytes32 instrumentHash, uint64 validUntil)",
  "function revokeCertificate(bytes32 certificateIdHash)",
  "function getCertificate(bytes32 certificateIdHash) view returns (tuple(bytes32 certificateHash, bytes32 instrumentHash, uint64 issuedAt, uint64 validUntil, address issuer, bool revoked, bool exists))",
  "function verifyCertificate(bytes32 certificateIdHash, bytes32 certificateHash) view returns (bool)",
  "function authorizedIssuers(address) view returns (bool)",
  "event CertificateRegistered(bytes32 indexed certificateIdHash, bytes32 indexed certificateHash, bytes32 indexed instrumentHash, address issuer, uint64 issuedAt, uint64 validUntil)",
  "event CertificateRevoked(bytes32 indexed certificateIdHash, address indexed revokedBy, uint256 revokedAt)",
];

function assertConfigured() {
  if (!blockchainConfigured) {
    throw new Error(
      "Blockchain is not configured yet. Add VITE_BLOCKCHAIN_CONTRACT_ADDRESS and VITE_BLOCKCHAIN_RPC_URL to .env.local.",
    );
  }
}

function canonicalCertificate(certificate, instrument) {
  return JSON.stringify({
    certificateId: certificate.id,
    instrumentId: certificate.instrumentId,
    issueDate: certificate.issueDate,
    validUntil: certificate.validUntil,
    status: certificate.status,
    inspector: certificate.inspector,
    instrument: {
      id: instrument?.id || "",
      type: instrument?.type || "",
      manufacturer: instrument?.manufacturer || "",
      model: instrument?.model || "",
      serialNumber: instrument?.serialNumber || "",
      capacity: instrument?.capacity || "",
      accuracy: instrument?.accuracy || "",
      owner: instrument?.owner || "",
      location: instrument?.location || "",
    },
  });
}

export function hashCertificate(certificate, instrument) {
  return sha256(toUtf8Bytes(canonicalCertificate(certificate, instrument)));
}

export function hashCertificateId(certificateId) {
  return sha256(toUtf8Bytes(`Pramaanika:${certificateId}`));
}

export function hashInstrument(instrumentId) {
  return sha256(toUtf8Bytes(`Pramaanika:Instrument:${instrumentId}`));
}

function validUntilTimestamp(dateString) {
  const timestamp = Math.floor(new Date(`${dateString}T23:59:59Z`).getTime() / 1000);
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    throw new Error("Invalid certificate validity date.");
  }
  return timestamp;
}

export async function connectBlockchainWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask is required to write certificate records to the blockchain.");
  }

  assertConfigured();

  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const network = await provider.getNetwork();

  if (Number(network.chainId) !== blockchainConfig.chainId) {
    throw new Error(
      `Wrong network. Please switch MetaMask to ${blockchainConfig.chainName} (chain ID ${blockchainConfig.chainId}).`,
    );
  }

  const signer = await provider.getSigner();
  return { provider, signer, address: await signer.getAddress() };
}

export async function getReadOnlyRegistry() {
  assertConfigured();

  if (!blockchainConfig.rpcUrl) {
    throw new Error("VITE_BLOCKCHAIN_RPC_URL is missing.");
  }

  const provider = new JsonRpcProvider(blockchainConfig.rpcUrl, blockchainConfig.chainId);
  return new Contract(
    blockchainConfig.contractAddress,
    CERTIFICATE_REGISTRY_ABI,
    provider,
  );
}

export async function anchorCertificateOnBlockchain(certificate, instrument) {
  const { signer, address } = await connectBlockchainWallet();
  const contract = new Contract(
    blockchainConfig.contractAddress,
    CERTIFICATE_REGISTRY_ABI,
    signer,
  );

  const certificateHash = hashCertificate(certificate, instrument);
  const certificateIdHash = hashCertificateId(certificate.id);
  const instrumentHash = hashInstrument(certificate.instrumentId);
  const validUntil = validUntilTimestamp(certificate.validUntil);

  const isIssuer = await contract.authorizedIssuers(address);
  if (!isIssuer) {
    throw new Error(
      "This wallet is not an authorized Pramaanika issuer. Authorize it from the contract owner account first.",
    );
  }

  const transaction = await contract.registerCertificate(
    certificateIdHash,
    certificateHash,
    instrumentHash,
    validUntil,
  );

  const receipt = await transaction.wait();

  return {
    certificateHash,
    certificateIdHash,
    transactionId: receipt.hash,
    issuer: address,
    network: blockchainConfig.chainName,
    explorerUrl: `${blockchainConfig.explorerUrl}/tx/${receipt.hash}`,
  };
}

/**
 * Some already-deployed demo versions of CertificateRegistry revert from
 * getCertificate("Certificate not found") instead of returning an empty record.
 * The CertificateRegistered event is immutable and contains everything needed
 * to reconstruct the record, so use it as a compatibility fallback.
 */
async function findCertificateFromEvents(contract, certificateIdHash) {
  const registrations = await contract.queryFilter(
    contract.filters.CertificateRegistered(certificateIdHash),
    0,
    "latest",
  );

  if (!registrations.length) return null;

  const latest = registrations.at(-1);
  const [eventCertificateIdHash, certificateHash, instrumentHash, issuer, issuedAt, validUntil] = latest.args;

  const revocations = await contract.queryFilter(
    contract.filters.CertificateRevoked(eventCertificateIdHash),
    latest.blockNumber,
    "latest",
  );

  return {
    certificateHash,
    instrumentHash,
    issuedAt,
    validUntil,
    issuer,
    revoked: revocations.length > 0,
    exists: true,
  };
}

async function readCertificateRecord(contract, certificateIdHash) {
  try {
    const record = await contract.getCertificate(certificateIdHash);
    if (record?.exists) return record;
  } catch {
    // Fall through to event-based lookup for older deployed contracts.
  }

  return findCertificateFromEvents(contract, certificateIdHash);
}

export async function verifyCertificateOnBlockchain(certificate, instrument) {
  if (!blockchainConfigured || !blockchainConfig.rpcUrl) {
    return {
      configured: false,
      verified: false,
      reason: "Blockchain is not configured.",
    };
  }

  const contract = await getReadOnlyRegistry();
  const certificateHash = hashCertificate(certificate, instrument);
  const certificateIdHash = hashCertificateId(certificate.id);
  const record = await readCertificateRecord(contract, certificateIdHash);

  if (!record) {
    return {
      configured: true,
      verified: false,
      found: false,
      certificateHash,
      certificateIdHash,
      reason: "Certificate is not anchored on this blockchain.",
    };
  }

  const revoked = Boolean(record.revoked);
  const expired = Number(record.validUntil) * 1000 < Date.now();
  const hashMatches = String(record.certificateHash).toLowerCase() === certificateHash.toLowerCase();
  const verified = !revoked && !expired && hashMatches;

  return {
    configured: true,
    verified,
    found: true,
    revoked,
    expired,
    hashMatches,
    certificateHash,
    certificateIdHash,
    issuer: record.issuer,
    issuedAt: Number(record.issuedAt),
    validUntil: Number(record.validUntil),
    reason: verified
      ? "Certificate fingerprint, revocation state, and validity period match the blockchain record."
      : revoked
        ? "This certificate has been revoked on the blockchain."
        : expired
          ? "This certificate has expired on the blockchain."
          : "The certificate fingerprint does not match the blockchain record.",
  };
}

export async function revokeCertificateOnBlockchain(certificate) {
  const { signer } = await connectBlockchainWallet();
  const contract = new Contract(
    blockchainConfig.contractAddress,
    CERTIFICATE_REGISTRY_ABI,
    signer,
  );
  const certificateIdHash = hashCertificateId(certificate.id);
  const transaction = await contract.revokeCertificate(certificateIdHash);
  const receipt = await transaction.wait();

  return {
    transactionId: receipt.hash,
    certificateIdHash,
    explorerUrl: `${blockchainConfig.explorerUrl}/tx/${receipt.hash}`,
  };
}

export function blockchainExplorerUrl(transactionId) {
  if (!transactionId || !transactionId.startsWith("0x")) return "";
  return `${blockchainConfig.explorerUrl}/tx/${transactionId}`;
}
