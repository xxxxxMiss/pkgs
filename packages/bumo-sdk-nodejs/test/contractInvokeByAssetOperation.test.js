'use strict';

require('chai').should();
const BigNumber = require('bignumber.js');
const co = require('co');

const BumoSDK = require('../index');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
});

describe('Test contract invoke by asset operation transaction', function() {

  it('test contract invoke by asset operation' , function() {

    const privateKey = 'privByFwi1dmPFvcXBTAo8Zw6pNEjpMRWxVRgXGE622EpuKwWk3HZw5F';
    const sourceAddress = 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';
    // const contractAddress = 'buQtzK1XfRHTKBet6e8jdGQqVGTWdEWueDbN';
    const contractAddress = 'ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom';
    co(function* () {
      const result = yield sdk.account.getNonce(sourceAddress);

      if (result.errorCode !== 0) {
        console.log(result);
        return;
      }
      let nonce = result.result.nonce;

      nonce = new BigNumber(nonce).plus(1).toString(10);

      let contractInvokeByBUOperation = yield sdk.operation.contractInvokeByAssetOperation({
        contractAddress,
        sourceAddress,
        assetAmount: '1',
        input: 'aaaa',
        code: 'TEST1',
        issuer: 'ulpi3oHdLKVjCA9gdyN8rfj7Ja363qce67CAF3',
        // metadata: 'Test contract create operation',
      });

      if (contractInvokeByBUOperation.errorCode !== 0) {
        console.log(contractInvokeByBUOperation);
        return;
      }

      // console.log(contractInvokeByBUOperation);
      // return;
      const operationItem = contractInvokeByBUOperation.result.operation;

      // const args = {
      //   sourceAddress,
      //   nonce,
      //   operations: [operationItem],
      //   signtureNumber: '100',
      //   // metadata: 'Test evaluation fee',
      // };
      //
      // let feeData = yield sdk.transaction.evaluateFee(args);
      // if (feeData.errorCode !== 0) {
      //   console.log(feeData);
      //   return;
      // }
      //
      // let feeLimit = feeData.result.feeLimit;
      // let gasPrice = feeData.result.gasPrice;
      let feeLimit = '100';
      let gasPrice = '100';
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
      let transactionInfo = yield sdk.transaction.submit({
        blob,
        signature: signature,
      });

      console.log(transactionInfo);

    }).catch(err => {
      console.log(err);
    });
  });

});
