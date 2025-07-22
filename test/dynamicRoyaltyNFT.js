const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DynamicRoyaltyNFT", function () {
  let nft, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("DynamicRoyaltyNFT");
    nft = await NFT.deploy("Test", "TST");
    await nft.waitForDeployment();
  });

  it("only owner can set default royalty", async function () {
    await expect(nft.connect(addr1).setDefaultRoyalty(addr1.address, 500)).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount").withArgs(addr1.address);
    await expect(nft.setDefaultRoyalty(addr1.address, 500)).to.emit(nft, "DefaultRoyaltySet").withArgs(addr1.address, 500);
  });

  it("only owner can set token royalty", async function () {
    await nft.mint(owner.address, 1);
    await expect(nft.connect(addr1).setTokenRoyalty(1, addr1.address, 500)).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount").withArgs(addr1.address);
    await expect(nft.setTokenRoyalty(1, addr1.address, 500)).to.emit(nft, "TokenRoyaltySet").withArgs(1, addr1.address, 500);
  });
});
