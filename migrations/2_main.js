const TimelockController = artifacts.require("TimelockController");
let DELAY, PROPOSERS, EXECUTORS;
module.exports = async function (deployer, network, accounts) {
    if (network == 'bsc') {
        DELAY = '86400';
        PROPOSERS = ['0xE4395b8b646A0144AA6D1256d8eCA3bF2ddA568E'];
        EXECUTORS = ['0xE4395b8b646A0144AA6D1256d8eCA3bF2ddA568E'];
    }
    if (network == 'testnet') {
        DELAY = '120';
        PROPOSERS = [ accounts[0] ];
        EXECUTORS = [ accounts[0] ];
    }
    if (network == 'dev') {
        DELAY = '2';
        PROPOSERS = [ accounts[0] ];
        EXECUTORS = [ accounts[0] ];
    }
    await deployer.deploy(TimelockController, DELAY, PROPOSERS, EXECUTORS);
    // const timelock = await TimelockController.deployed();
};
