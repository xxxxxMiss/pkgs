'use strict';

require('chai').should();
const BumoSDK = require('../index');
const BigNumber = require('bignumber.js');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
});

describe('Test account Set Metadata Operation', function() {

  it('test operation.accountSetMetadataOperation()', async() => {

    const privateKey = 'privByFwi1dmPFvcXBTAo8Zw6pNEjpMRWxVRgXGE622EpuKwWk3HZw5F';
    const sourceAddress = 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';

    // Get nonce
    const result = await sdk.account.getNonce(sourceAddress);
    if (result.errorCode !== 0) {
      console.log(result);
      return;
    }
    let nonce = result.result.nonce;
    nonce = new BigNumber(nonce).plus(1).toString(10);

    // build operation
    let accountSetMetadataOperation = sdk.operation.accountSetMetadataOperation({
      key: 'mykey1',
      value: 'myvalue1',
      // deleteFlag: 1,
      version: '1'
    });
    console.log(accountSetMetadataOperation.result.operation);
    if (accountSetMetadataOperation.errorCode !== 0) {
      console.log(accountSetMetadataOperation);
      return;
    }

    const operationItem = accountSetMetadataOperation.result.operation;

    // console.log(operationItem);
    // return;
    //const args = {
    //   sourceAddress,
    //   nonce,
    //   operations: [operationItem],
    //   signtureNumber: '100',
    // };
    //
    // let feeData = await sdk.transaction.evaluateFee(args);
    // if (feeData.errorCode !== 0) {
    //   console.log(feeData);
    //   return;
    // }

    // let feeLimit = feeData.result.feeLimit;
    // let gasPrice = feeData.result.gasPrice;

    // console.log(feeData);
    let feeLimit = '10000';
    let gasPrice = '10000';
    // =============================
    // build blob
    // =============================
    let blobInfo = sdk.transaction.buildBlob({
      sourceAddress,
      gasPrice,
      feeLimit,
      nonce,
      operations: [ operationItem ],
    });

    //console.log(blobInfo)

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
    console.log(signatureInfo.result.signatures);
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
