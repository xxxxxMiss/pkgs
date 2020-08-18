'use strict';

require('chai').should();
const BigNumber = require('bignumber.js');
const BumoSDK = require('bumo-sdk');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
});

describe('The demo of bumo-sdk for exchange ', function() {

  it('Create account', async() => {
    const keypair = await sdk.account.create();
    console.log(keypair);
  });

  it('Get account information', async() => {
    const address = 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';
    const info = await sdk.account.getInfo(address);
    console.log(info);
  });

  it('Check address validity', async() => {
    const address = 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';
    const data = await sdk.account.checkValid(address);
    console.log(data);
  });

  it('Get account balance', async() => {
    const address = 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';
    const data = await sdk.account.getBalance(address);
    console.log(data);
  });

  it('Get account nonce', async() => {
    const address = 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';
    const data = await sdk.account.getNonce(address);
    console.log(data);
  });

  it('Get the latest block number', async() => {
    const data = await sdk.block.getNumber();
    console.log(data);
  });

  it('Check local node block synchronization status', async() => {
    const data = await sdk.block.checkStatus();
    console.log(data);
  });

  it('Get transactions for a blockNumber', async() => {
    const blockNumber = '100';
    const data = await sdk.block.getTransactions(blockNumber);
    console.log(data);
  });

  it('Get block information', async() => {
    const data = await sdk.block.getInfo('1');
    console.log(data);
  });

  it('Get the latest block information', async() => {
    const data = await sdk.block.getLatestInfo();
    console.log(data);
  });

  it('Get the validators in the specified blockNumber', async() => {
    const data = await sdk.block.getValidators('100');
    console.log(data);
  });

  it('Get the latest validators', async() => {
    const data = await sdk.block.getLatestValidators();
    console.log(data);
  });

  it('Get block rewards and validator rewards in the specified blockNumber', async() => {
    const data = await sdk.block.getReward('100');
    console.log(data);
  });

  it('Get block rewards and validator rewards in the latest blockNumber', async() => {
    const data = await sdk.block.getLatestReward();
    console.log(data);
  });

  it('Get fees in the specified blockNumber', async() => {
    const data = await sdk.block.getFees('100');
    console.log(data);
  });

  it('Get fees in the latest blockNumber', async() => {
    const data = await sdk.block.getLatestFees();
    console.log(data);
  });

  // ====================================
  // Send BU contains 4 steps:
  // 1. build operation (buSendOperation)
  // 2. build blob
  // 3. sign blob with sender private key
  // 4. submit transaction
  // ====================================
  it('Send BU', async() => {
    const senderPrivateKey = 'privByFwi1dmPFvcXBTAo8Zw6pNEjpMRWxVRgXGE622EpuKwWk3HZw5F';
    const senderAddress = 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';
    const receiverAddress = 'ulpi3oHdLKVjCA9gdyN8rfj7Ja363qce67CAF3';

    const accountInfo = await sdk.account.getNonce(senderAddress);

    if (accountInfo.errorCode !== 0) {
      console.log(accountInfo);
      return;
    }
    let nonce = accountInfo.result.nonce;
    // nonce + 1
    nonce = new BigNumber(nonce).plus(1).toString(10);

    // ====================================
    // 1. build operation (buSendOperation)
    // ====================================
    const operationInfo = sdk.operation.buSendOperation({
      sourceAddress: senderAddress,
      destAddress: receiverAddress,
      buAmount: '7000',
      metadata: 'send bu demo',
    });

    if (operationInfo.errorCode !== 0) {
      console.log(operationInfo);
      return;
    }

    const operationItem = operationInfo.result.operation;

    // ====================================
    // 2. build blob
    // ====================================
    const blobInfo = sdk.transaction.buildBlob({
      sourceAddress: senderAddress,
      gasPrice: '1000',
      feeLimit: '306000',
      nonce,
      operations: [ operationItem ],
    });

    if (blobInfo.errorCode !== 0) {
      console.log(blobInfo);
      return;
    }

    const blob = blobInfo.result.transactionBlob;

    // ====================================
    // 3. sign blob with sender private key
    // ====================================
    let signatureInfo = sdk.transaction.sign({
      privateKeys: [ senderPrivateKey ],
      blob,
    });

    if (signatureInfo.errorCode !== 0) {
      console.log(signatureInfo);
      return;
    }

    const signature = signatureInfo.result.signatures;

    // ====================================
    // 4. submit transaction
    // ====================================
    const transactionInfo = await sdk.transaction.submit({
      blob,
      signature: signature,
    });

    if (transactionInfo.errorCode !== 0) {
      console.log(transactionInfo);
    }
    console.log(transactionInfo);
  });

});
