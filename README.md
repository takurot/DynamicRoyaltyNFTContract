# Dynamic Royalty NFT Contract

This project implements a dynamic royalty distribution system for NFTs (ERC721 tokens) using OpenZeppelin Contracts. The contract is designed to set default royalties and adjust royalties for individual tokens as needed. It leverages the ERC2981 standard, making it compatible with marketplaces that support royalty standards.

## Features

- **Dynamic Royalty Management**: Allows setting default royalties for all tokens and custom royalties per token.
- **ERC721 Compliance**: Implements the ERC721 standard for NFTs.
- **ERC2981 Compliance**: Supports the ERC2981 standard for royalty payments, ensuring compatibility with compliant NFT marketplaces.

## Prerequisites

- **Solidity 0.8+**
- **OpenZeppelin Contracts**: Ensure OpenZeppelin Contracts is installed for ERC721 and ERC2981 support.
- **Development Environment**: You can use tools like Hardhat, Truffle, or Remix for testing and deploying this contract.

## Contract Overview

The `DynamicRoyaltyNFT` contract extends both `ERC721` and `ERC2981` from OpenZeppelin, allowing it to handle NFT minting and royalty management.

### Key Functions

- **setDefaultRoyalty**: Sets a default royalty that applies to all tokens.
- **setTokenRoyalty**: Sets a unique royalty for a specific token.
- **supportsInterface**: Confirms support for ERC721 and ERC2981 interfaces.

## Usage

### Setting Default Royalties

You can set default royalties using the `setDefaultRoyalty` function. This sets a royalty rate that applies to all NFTs in the contract.

```solidity
contractInstance.setDefaultRoyalty(receiverAddress, feeNumerator);
```

- **`receiverAddress`**: The address that will receive royalty payments.
- **`feeNumerator`**: The royalty percentage. For example, to set a 5% royalty, pass `500` (since 10000 represents 100%).

### Setting Individual Token Royalties

If you need a unique royalty rate for a specific token, use the `setTokenRoyalty` function.

```solidity
contractInstance.setTokenRoyalty(tokenId, receiverAddress, feeNumerator);
```

- **`tokenId`**: The ID of the token.
- **`receiverAddress`**: The address that will receive royalty payments for this specific token.
- **`feeNumerator`**: The royalty percentage specific to this token.

### Checking Interface Support

To verify that the contract supports ERC721 and ERC2981, use the `supportsInterface` function.

```solidity
contractInstance.supportsInterface(interfaceId);
```

This function is useful for ensuring compatibility with external applications or marketplaces.

## Notes

- **Royalty Payment**: Note that while this contract sets royalty information, actual royalty payment must be implemented by the marketplace where the NFT is sold.
- **Access Control**: For production, consider adding access control to restrict who can set royalties.

## Installation

1. Install OpenZeppelin Contracts:

```bash
npm install @openzeppelin/contracts
```

2. Deploy the contract with a development environment (e.g., Hardhat or Truffle) or directly on Remix.

## License

This project is licensed under the MIT License.
