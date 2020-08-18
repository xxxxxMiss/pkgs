'use strict';

require('chai').should();
const BigNumber = require('bignumber.js');
const BumoSDK = require('bumo-sdk');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
});

describe('The demo of submit transaction ', function() {

  it('The demo of submit transaction', async() => {
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
