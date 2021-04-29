const web3 = require('web3');
const {accounts, contract} = require('@openzeppelin/test-environment');
const {BN, expectRevert, time, expectEvent, constants} = require('@openzeppelin/test-helpers');
const {expect} = require('chai');
const ethers = require('ethers');

const Timelock = contract.fromArtifact('Timelock');
const MockBEP20 = contract.fromArtifact('MockBEP20');

let DELAY;

function encodeParameters(types, values) {
    const abi = new ethers.utils.AbiCoder();
    return abi.encode(types, values);
}

function get_interval(hours) {
    return parseInt((new Date().getTime() + (60 * 60 * hours * 1000)) / 1000).toString();
}

async function increase(value) {
    await time.increase(value.toNumber());
    await time.advanceBlock();
}
const duration = {
    seconds: function (val) {
        return new BN(val)
    },
    minutes: function (val) {
        return new BN(val).mul(this.seconds("60"))
    },
    hours: function (val) {
        return new BN(val).mul(this.minutes("60"))
    },
    days: function (val) {
        return new BN(val).mul(this.hours("24"))
    },
    weeks: function (val) {
        return new BN(val).mul(this.days("7"))
    },
    years: function (val) {
        return new BN(val).mul(this.days("365"))
    },
}

describe('Timelock', function () {
    beforeEach(async function () {
        _deployer = accounts[0];
        _user = accounts[1];
        const MINT = web3.utils.toWei('100');
        DELAY = '2';
        this.token = await MockBEP20.new("test", "test", MINT, {from: _deployer});
        this.timelock = await Timelock.new(DELAY, _deployer, {from: _deployer});
        await this.token.transfer(this.timelock.address, MINT, {from: _deployer});
        await this.token.transferOwnership(this.timelock.address, {from: _deployer});

    });
    describe('Timelock operations', function () {
        it('transfer', async function () {
            const eta = get_interval(24);
            const amount = web3.utils.toWei('1');
            const target = this.token.address;
            const value = 0;
            const signature = 'transfer(address,uint256)';
            const data = encodeParameters(['address', 'uint256'], [_user, amount]);
            console.log('target', target);
            console.log('value', value);
            console.log('signature', signature);
            console.log('data', data);
            console.log('eta', eta);
            await this.timelock.queueTransaction(target, value, signature, data, eta, {from: _deployer});
            await increase(duration.days(4));
            await this.timelock.executeTransaction(target, value, signature, data, eta, {from: _deployer});

            let balanceOfTimelock = await this.token.balanceOf(this.timelock.address, {from: _deployer});
                balanceOfTimelock = web3.utils.fromWei(balanceOfTimelock, 'ether').toString();
            let balanceOfUser = await this.token.balanceOf(_user, {from: _user});
                balanceOfUser = web3.utils.fromWei(balanceOfUser, 'ether').toString();
            console.log('balanceOfTimelock',  balanceOfTimelock);
            console.log('balanceOfUser',  balanceOfUser);
        });
    });
});
