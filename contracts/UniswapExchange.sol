// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
}

contract UniswapExchange {
    address private constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private owner;
    // address private constant WETH_ADDRESS = <WETHAddress>; // Wrapped Ether Address

    constructor() {
    owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }   

    function swapTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
        // uint256 amountOutMin
    ) external {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        IERC20(tokenIn).transfer(address(this), amountIn);

        IERC20(tokenIn).approve(UNISWAP_ROUTER_ADDRESS, amountIn);

        assembly {
            let uniswapRouter := add(0, UNISWAP_ROUTER_ADDRESS)
            let pathPtr := mload(0x40)
            mstore(pathPtr, 0x20)
            mstore(add(pathPtr, 0x20), 2)
            mstore(add(pathPtr, 0x40), tokenIn)
            mstore(add(pathPtr, 0x60), tokenOut)

            let swapCallSuccess := call(
                gas(),
                uniswapRouter,
                0,
                pathPtr,
                0x80,
                0,
                0
            )
            if eq(swapCallSuccess, 0) {
                revert(0, 0)
            }
        }

        uint256 swappedAmount = IERC20(tokenOut).balanceOf(address(this));
        IERC20(tokenOut).transfer(msg.sender, swappedAmount);
    }

    function withdrawTokens(address token, uint256 amount) external onlyOwner{
        IERC20(token).transfer(owner, amount);
    }
}