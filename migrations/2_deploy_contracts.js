const Liquidator = artifacts.require('Liquidator');
const LendingPoolAddress = artifacts.require('ILendingPoolAddressesProvider.sol')
const FlashLoanReceiver = artifacts.require('FlashLoanReceiverBase.sol')

module.exports = function(deployer) {
  deployer.then(async () => {
    // const lendingPoolAddressProvider = await LendingPoolAddress.at('0x506B0B2CF20FAA8f38a4E2B524EE43e1f4458Cc5');
    // await deployer.deploy(Liquidator, lendingPoolAddressProvider.address);
  })
};
