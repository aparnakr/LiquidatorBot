require('ts-node/register');
const HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = "cycle increase miracle mouse oblige alien life wire proof vacant section coffee";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 5000000
    },
    kovan: {
      provider: () => {
        return new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/ae145ebad7c8499db7901246fd1271f7");
      },
      network_id: 42,
      gas: 6700000,
      gasPrice: 10000000000
    },
  },
  compilers: {
    solc: {
      version: "0.5.10",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
