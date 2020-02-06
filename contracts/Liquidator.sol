pragma solidity 0.5.10;

import "./FlashLoanReceiverBase.sol";
import "./OptionsContract.sol";
import "./OptionsExchange.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./ILendingPoolAddressesProvider.sol";
contract Liquidator is FlashLoanReceiverBase{

    using SafeMath for uint256;

    constructor(ILendingPoolAddressesProvider ILendingAddress) public FlashLoanReceiverBase(ILendingAddress){
    }

    // kovan address
    address optionsExchangeAddress = 0x3B967C6b89458a590bd3948Bd0053E80455D7b0C;

    function executeOperation(address _reserve, uint256 _amount, uint256 _fee, bytes calldata _params) external {
        (address oTokenAddress, address vaultAddr) = getParams(_params);
        address payable vaultAddress = address(uint160(vaultAddr));
        OptionsContract oToken = OptionsContract(oTokenAddress);
        // 1. Get _amount from the reserve pool
        // 2. Buy oTokens on uniswap
        uint256 oTokensToBuy = oToken.maxOTokensLiquidatable(vaultAddress);
        OptionsExchange exchange = OptionsExchange(optionsExchangeAddress);
        exchange.buyOTokens.value(_amount)(address(uint160(address(this))), oTokenAddress, address(0), oTokensToBuy);
        // 3. Liquidate
        require(oToken.isUnsafe(vaultAddress), 'cannot liquidate a safe vault');
        oToken.approve(oTokenAddress, oTokensToBuy);
        oToken.liquidate(vaultAddress, oTokensToBuy);
        // 4. pay back the $
        transferFundsBackToPoolInternal(_reserve, _amount.add(_fee));
    }

    function bytesToAddress(bytes memory bys) private view returns (address addr) {
     assembly {
        addr := mload(add(bys,20))
        }
    }

    function getParams(bytes memory source) public view returns (address, address) {
        bytes memory half1 = new bytes(20);
        bytes memory half2 = new bytes(20);
        for (uint j = 0; j < 20; j++) {
                half1[j] = source[j];
                half2[j] = source[j+20];
        }
        return (bytesToAddress(half1), bytesToAddress(half2));
    }
}