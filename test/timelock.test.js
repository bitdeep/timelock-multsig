const web3 = require('web3');
const {accounts, contract} = require('@openzeppelin/test-environment');
const {BN, expectRevert, time, expectEvent, constants} = require('@openzeppelin/test-helpers');
const {expect} = require('chai');
const TimelockController = contract.fromArtifact('TimelockController');
const MockBEP20 = contract.fromArtifact('MockBEP20');
let DELAY, PROPOSERS, EXECUTORS;
describe('TimelockController', function () {
    beforeEach(async function () {
        _deployer = accounts[0];
        _user = accounts[1];
        const MINT = web3.utils.toWei('100');
        DELAY = '2';
        PROPOSERS = [accounts[0]];
        EXECUTORS = [accounts[0]];
        this.token = await MockBEP20.new("test", "test", MINT, {from: _deployer});
        this.timelock = await TimelockController.new(DELAY, PROPOSERS, EXECUTORS, {from: _deployer});
    });
    describe('Timelock security', function () {
        it('getMinDelay', async function () {
            const getMinDelay = await this.timelock.getMinDelay({from: _deployer});
            expect(getMinDelay).to.be.bignumber.equal(new BN(DELAY));
        });
    });
});
