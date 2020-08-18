'use strict';

require('chai').should();
const BigNumber = require('bignumber.js');
const co = require('co');

const BumoSDK = require('../index');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
  // host: '192.168.1.34:36002',
});

describe('Test ctp10Token Transfer From Operation', function() {

  it('Test ctp10Token Transfer From  Operation', async() => {
    const privateKey = 'privByFwi1dmPFvcXBTAo8Zw6pNEjpMRWxVRgXGE622EpuKwWk3HZw5F';
    let sourceAddress = 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';
    const result = await sdk.account.getNonce(sourceAddress);

    if (result.errorCode !== 0) {
      console.log(result);
      return;
    }
    let nonce = result.result.nonce;

    nonce = new BigNumber(nonce).plus(1).toString(10);

    let ctp10TokenTransferFromOperation = await sdk.operation.ctp10TokenTransferFromOperation({
      contractAddress: 'ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom',
      destAddress: 'ulpi3oHdLKVjCA9gdyN8rfj7Ja363qce67CAF3',
      fromAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      tokenAmount: '3',
      sourceAddress,
      // metadata: '',
    });

    if (ctp10TokenTransferFromOperation.errorCode !== 0) {
      console.log(ctp10TokenTransferFromOperation);
      return;
    }

    const operationItem = ctp10TokenTransferFromOperation.result.operation;

    const args = {
      sourceAddress,
      nonce,
      operations: [operationItem],
      signtureNumber: '100',
      // metadata: 'Test evaluation fee',
    };

    let feeData = await sdk.transaction.evaluateFee(args);
    if (feeData.errorCode !== 0) {
      console.log(feeData);
      return;
    }

    // console.log(feeData);
    // return;
    let feeLimit = feeData.result.feeLimit;
    let gasPrice = feeData.result.gasPrice;

    // 2. build blob
    let blobInfo = sdk.transaction.buildBlob({
      sourceAddress: sourceAddress,
      gasPrice,
      feeLimit,
      nonce: nonce,
      operations: [ operationItem ],
    });

    if (blobInfo.errorCode !== 0) {
      console.log(blobInfo);
      return;
    }

    let blob = blobInfo.result.transactionBlob;

    // 3. sign blob
    let signatureInfo = sdk.transaction.sign({
      privateKeys: [ privateKey ],
      blob,
    });

    if (signatureInfo.errorCode !== 0) {
      console.log(signatureInfo);
      return;
    }

    let signature = signatureInfo.result.signatures;
    // 4. submit transaction
    let transactionInfo = await sdk.transaction.submit({
      blob,
      signature: signature,
    });

    console.log(transactionInfo);
  });

});
