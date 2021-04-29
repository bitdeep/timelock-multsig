const Timelock = artifacts.require("Timelock");
module.exports = async function (deployer, network, accounts) {
    let admin;
    if (network == 'bsc') {
        DELAY = '86400';
        admin = accounts[0];
    }
    if (network == 'testnet') {
        DELAY = '120';
        admin = accounts[0];
    }
    if (network == 'dev') {
        DELAY = '2';
        admin = accounts[0];
    }
    await deployer.deploy(Timelock, DELAY, admin);
    // const timelock = await TimelockController.deployed();
};
