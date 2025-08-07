// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract DynamicRoyaltyNFT is ERC721, ERC2981, Ownable2Step, Pausable {
    uint256 private _currentTokenId;

    error InvalidRoyaltyReceiver();
    error RoyaltyFeeTooHigh();
    error NonexistentToken();

    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender) {}

    event DefaultRoyaltySet(address indexed receiver, uint96 feeNumerator);
    event TokenRoyaltySet(uint256 indexed tokenId, address indexed receiver, uint96 feeNumerator);
    event Mint(address indexed to, uint256 indexed tokenId);

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner whenNotPaused {
        if (receiver == address(0)) revert InvalidRoyaltyReceiver();
        if (feeNumerator > _feeDenominator()) revert RoyaltyFeeTooHigh();
        _setDefaultRoyalty(receiver, feeNumerator);
        emit DefaultRoyaltySet(receiver, feeNumerator);
    }

    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) external onlyOwner whenNotPaused {
        if (receiver == address(0)) revert InvalidRoyaltyReceiver();
        if (feeNumerator > _feeDenominator()) revert RoyaltyFeeTooHigh();
        if (_ownerOf(tokenId) == address(0)) revert NonexistentToken();
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
        emit TokenRoyaltySet(tokenId, receiver, feeNumerator);
    }

    function mint(address to) external onlyOwner whenNotPaused returns (uint256 tokenId) {
        tokenId = ++_currentTokenId;
        _safeMint(to, tokenId);
        emit Mint(to, tokenId);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
