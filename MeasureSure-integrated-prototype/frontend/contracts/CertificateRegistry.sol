// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title MeasureSure Certificate Registry
/// @notice Anchors certificate fingerprints and validity on an EVM-compatible blockchain.
///         No personal or certificate document contents are stored on-chain.
contract CertificateRegistry {
    struct CertificateRecord {
        bytes32 certificateHash;
        bytes32 instrumentHash;
        uint64 issuedAt;
        uint64 validUntil;
        address issuer;
        bool revoked;
        bool exists;
    }

    address public owner;
    mapping(address => bool) public authorizedIssuers;
    mapping(bytes32 => CertificateRecord) private certificates;

    event IssuerAuthorizationChanged(address indexed issuer, bool authorized);
    event CertificateRegistered(
        bytes32 indexed certificateIdHash,
        bytes32 indexed certificateHash,
        bytes32 indexed instrumentHash,
        address issuer,
        uint64 issuedAt,
        uint64 validUntil
    );
    event CertificateRevoked(
        bytes32 indexed certificateIdHash,
        address indexed revokedBy,
        uint256 revokedAt
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyIssuer() {
        require(authorizedIssuers[msg.sender], "Not an authorized issuer");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
        emit IssuerAuthorizationChanged(msg.sender, true);
    }

    function setIssuer(address issuer, bool authorized) external onlyOwner {
        require(issuer != address(0), "Invalid issuer");
        authorizedIssuers[issuer] = authorized;
        emit IssuerAuthorizationChanged(issuer, authorized);
    }

    function registerCertificate(
        bytes32 certificateIdHash,
        bytes32 certificateHash,
        bytes32 instrumentHash,
        uint64 validUntil
    ) external onlyIssuer {
        require(certificateIdHash != bytes32(0), "Invalid certificate ID");
        require(certificateHash != bytes32(0), "Invalid certificate hash");
        require(instrumentHash != bytes32(0), "Invalid instrument hash");
        require(!certificates[certificateIdHash].exists, "Certificate already registered");
        require(validUntil > block.timestamp, "Certificate already expired");

        certificates[certificateIdHash] = CertificateRecord({
            certificateHash: certificateHash,
            instrumentHash: instrumentHash,
            issuedAt: uint64(block.timestamp),
            validUntil: validUntil,
            issuer: msg.sender,
            revoked: false,
            exists: true
        });

        emit CertificateRegistered(
            certificateIdHash,
            certificateHash,
            instrumentHash,
            msg.sender,
            uint64(block.timestamp),
            validUntil
        );
    }

    function revokeCertificate(bytes32 certificateIdHash) external {
        CertificateRecord storage certificate = certificates[certificateIdHash];
        require(certificate.exists, "Certificate not found");
        require(
            msg.sender == owner || msg.sender == certificate.issuer,
            "Not authorized to revoke"
        );
        require(!certificate.revoked, "Certificate already revoked");

        certificate.revoked = true;
        emit CertificateRevoked(
            certificateIdHash,
            msg.sender,
            block.timestamp
        );
    }

    function getCertificate(bytes32 certificateIdHash)
        external
        view
        returns (CertificateRecord memory)
    {
        return certificates[certificateIdHash];
    }

    function verifyCertificate(
        bytes32 certificateIdHash,
        bytes32 certificateHash
    ) external view returns (bool) {
        CertificateRecord memory certificate = certificates[certificateIdHash];

        return
            certificate.exists &&
            !certificate.revoked &&
            certificate.certificateHash == certificateHash &&
            block.timestamp <= certificate.validUntil;
    }
}
