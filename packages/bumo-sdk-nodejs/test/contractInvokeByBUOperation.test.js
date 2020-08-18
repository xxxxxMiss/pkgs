'use strict';

require('chai').should();
const BigNumber = require('bignumber.js');
const co = require('co');

const BumoSDK = require('../index');

const sdk = new BumoSDK({
  host: 'seed1.bumotest.io:26002',
});

describe('Test contract Invoke By BU  transaction', function() {

  it('test contract Invoke By BU' , function() {

    const privateKey = 'private key';
    const sourceAddress = 'buQhP94E8FjWDF3zfsxjqVQDeBypvzMrB3y3';
    const contractAddress = 'buQtzK1XfRHTKBet6e8jdGQqVGTWdEWueDbN';
    // const contractAddress = 'buQqbhTrfAqZtiX79zp4MWwUVfpcadvtz2TM';
    co(function* () {
      const result = yield sdk.account.getNonce(sourceAddress);

      if (result.errorCode !== 0) {
        console.log(result);
        return;
      }
      let nonce = result.result.nonce;

      nonce = new BigNumber(nonce).plus(1).toString(10);

      let contractInvokeByBUOperation = yield sdk.operation.contractInvokeByBUOperation({
        contractAddress,
        sourceAddress,
        buAmount: '0',
        input: 'aaaa',
        // metadata: 'Test contract create operation',
      });

      if (contractInvokeByBUOperation.errorCode !== 0) {
        console.log(contractInvokeByBUOperation);
        return;
      }

      // console.log(contractInvokeByBUOperation);
      // return;
      const operationItem = contractInvokeByBUOperation.result.operation;

      const args = {
        sourceAddress,
        nonce,
        operations: [operationItem],
        signtureNumber: '100',
        // metadata: 'Test evaluation fee',
      };

      let feeData = yield sdk.transaction.evaluateFee(args);
      if (feeData.errorCode !== 0) {
        console.log(feeData);
        return;
      }

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
