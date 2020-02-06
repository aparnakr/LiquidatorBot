pragma solidity 0.5.10;

contract OptionsContract {
        function liquidate(address payable vaultOwner, uint256 oTokensToLiquidate) public;
        function  maxOTokensLiquidatable(address payable vaultOwner) public view returns (uint256);
        function isUnsafe(address payable vaultOwner) public view returns (bool);
        function approve(address spender, uint256 amount) public returns (bool);
}