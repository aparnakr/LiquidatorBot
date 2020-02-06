import {LiquidatorInstance,
        LendingPoolInstance,
        OptionsContractInstance,
        OptionsExchangeInstance} from '../build/types/truffle-types';

const Liquidator = artifacts.require('Liquidator');
const LendingPool = artifacts.require('LendingPool');
const OptionsContract = artifacts.require('OptionsContract');
const OptionsExchange = artifacts.require('OptionsExchange');

contract('Liquidator', accounts => {

  const creatorAddress = accounts[0];
  const ETHReserveAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

  let liquidator: LiquidatorInstance;
  let lendingPool: LendingPoolInstance;
  let oToken: OptionsContractInstance;
  let optionsExchange: OptionsExchangeInstance;

  const isDeployed = true;
  const liquidatorAddress = '0x6D15e91332F4D2267b2D4800049dC91A340932DB';

  before('set up contracts', async () => {
    if(!isDeployed) {
      liquidator = await Liquidator.deployed();
      console.log(liquidator.address);
    } else {
      liquidator = await Liquidator.at(liquidatorAddress)
    }
    lendingPool = await LendingPool.at('0x580D4Fdc4BF8f9b5ae2fb9225D584fED4AD5375c');
    oToken = await OptionsContract.at('0x8794fe9332930f7B42aD33cf14b2EFaF7aC49F76');
    optionsExchange = await OptionsExchange.at('0x3B967C6b89458a590bd3948Bd0053E80455D7b0C');
  })

  describe('#liquidate()', async() => {

    it ('test the bytes return values', async () => {
    var oTokenAddressBytes = web3.utils.hexToBytes(web3.utils.toHex(oToken.address));
    var vaultAddressBytes = web3.utils.hexToBytes(web3.utils.toHex(creatorAddress));
    const data = oTokenAddressBytes.concat(vaultAddressBytes);

    var params = (await liquidator.getParams(data));
    expect(params[0].toString()).to.equal(oToken.address);
    expect(params[1].toString()).to.equal(creatorAddress);
    })

    xit ('get ETH in AAVE', async() => {
      console.log(((await lendingPool.getReserveData(ETHReserveAddress))[1].toString()));
    })

    it('test flash loan liquidate', async () => {
      var oTokenAddressBytes = web3.utils.hexToBytes(web3.utils.toHex(oToken.address));
      var vaultAddressBytes = web3.utils.hexToBytes(web3.utils.toHex(creatorAddress));
      const data = oTokenAddressBytes.concat(vaultAddressBytes);

      const amountOTokens = await oToken.maxOTokensLiquidatable(creatorAddress);
      const premiumToPay = await optionsExchange.premiumToPay(oToken.address, '0x0000000000000000000000000000000000000000', amountOTokens);
      await lendingPool.flashLoan(liquidator.address, ETHReserveAddress, premiumToPay, data, {
        from: creatorAddress,
        gas: '10000000'
      });
    })

  })

})
