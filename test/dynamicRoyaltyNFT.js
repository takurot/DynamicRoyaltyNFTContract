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

  it("validates default royalty input and access control", async function () {
    await expect(
      nft.connect(addr1).setDefaultRoyalty(addr1.address, 500)
    )
      .to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount")
      .withArgs(addr1.address);

    await expect(
      nft.setDefaultRoyalty(ethers.ZeroAddress, 500)
    ).to.be.revertedWithCustomError(nft, "InvalidRoyaltyReceiver");

    await expect(
      nft.setDefaultRoyalty(addr1.address, 10001)
    ).to.be.revertedWithCustomError(nft, "RoyaltyFeeTooHigh");

    await expect(nft.setDefaultRoyalty(addr1.address, 500))
      .to.emit(nft, "DefaultRoyaltySet")
      .withArgs(addr1.address, 500);
  });

  it("token royalty requires existing token and proper inputs", async function () {
    await nft.mint(owner.address);

    await expect(
      nft.setTokenRoyalty(1, ethers.ZeroAddress, 500)
    ).to.be.revertedWithCustomError(nft, "InvalidRoyaltyReceiver");

    await expect(
      nft.setTokenRoyalty(1, addr1.address, 10001)
    ).to.be.revertedWithCustomError(nft, "RoyaltyFeeTooHigh");

    await expect(
      nft.setTokenRoyalty(2, addr1.address, 500)
    ).to.be.revertedWithCustomError(nft, "NonexistentToken");

    await expect(
      nft.connect(addr1).setTokenRoyalty(1, addr1.address, 500)
    )
      .to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount")
      .withArgs(addr1.address);

    await expect(nft.setTokenRoyalty(1, addr1.address, 500))
      .to.emit(nft, "TokenRoyaltySet")
      .withArgs(1, addr1.address, 500);
  });

  it("mints sequential tokenIds and supports pausing", async function () {
    await expect(nft.mint(owner.address))
      .to.emit(nft, "Mint")
      .withArgs(owner.address, 1);
    await expect(nft.mint(addr1.address))
      .to.emit(nft, "Mint")
      .withArgs(addr1.address, 2);

    await nft.pause();

    await expect(nft.mint(owner.address)).to.be.revertedWithCustomError(
      nft,
      "EnforcedPause"
    );

    await expect(
      nft.setDefaultRoyalty(addr1.address, 500)
    ).to.be.revertedWithCustomError(nft, "EnforcedPause");

    await expect(
      nft.setTokenRoyalty(1, addr1.address, 500)
    ).to.be.revertedWithCustomError(nft, "EnforcedPause");

    await nft.unpause();

    await expect(nft.mint(owner.address))
      .to.emit(nft, "Mint")
      .withArgs(owner.address, 3);
  });
});

