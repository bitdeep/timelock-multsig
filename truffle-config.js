require('dotenv').config({path: '.env'});
const HDWalletProvider = require('@truffle/hdwallet-provider');
module.exports = {
  networks: {
    dev: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    testnet: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://data-seed-prebsc-1-s3.binance.org:8545/`),
      network_id: 97,
      confirmations: 3,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 3,
      skipDryRun: true
    }

  },
  compilers: {
    solc: {
      version: "0.8.3",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    bscscan: process.env.bscscan
  },
  mocha: {
    enableTimeouts: false,
    before_timeout: 120000
  }
};
