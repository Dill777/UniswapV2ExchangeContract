const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UniswapExchange Contract", function () {
  let uniswapExchange;
  let owner;
  let addr1;

  beforeEach(async function () {
    const UniswapExchange = await ethers.getContractFactory("UniswapExchange");
    uniswapExchange = await UniswapExchange.deploy();
    await uniswapExchange.waitForDeployment();

    [owner, addr1] = await ethers.getSigners();
  });

  it("Should swap tokens", async function () {
    const tokenInAddress = "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"; 
    const tokenOutAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; 
    const amountIn = ethers.parseEther("1"); // Amount in wei


    const tokenIn = await ethers.getContractAt("IERC20", tokenInAddress);
    console.log(uniswapExchange.target);
    await tokenIn.transfer(uniswapExchange.target, amountIn);


    await uniswapExchange.swapTokens(tokenInAddress, tokenOutAddress, amountIn);


    const tokenOut = await ethers.getContractAt("IERC20", tokenOutAddress);
    const ownerBalance = await tokenOut.balanceOf(owner.target);


    expect(ownerBalance).to.not.equal(0);
  });

  it("Should withdraw tokens by the owner", async function () {
    const tokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // Replace with actual address
    const amountToWithdraw = ethers.parseEther("1"); // Amount in wei

    // Transfer tokens to the contract
    const token = await ethers.getContractAt("IERC20", tokenAddress);
    await token.transfer(uniswapExchange.target, amountToWithdraw);

    // Call the withdrawTokens function
    await uniswapExchange.connect(owner).withdrawTokens(tokenAddress, amountToWithdraw);

    // Check token balance of the owner
    const ownerBalance = await token.balanceOf(owner.target);

    // Assert that the balance has increased
    expect(ownerBalance).to.not.equal(0);
  });
});