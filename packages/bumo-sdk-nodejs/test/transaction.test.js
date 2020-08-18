'use strict';

require('chai').should();
const BigNumber = require('bignumber.js');
const co = require('co');

const BumoSDK = require('../index');

const sdk = new BumoSDK({
  //host: 'seed1.bumotest.io:26002',
   host: '172.17.3.121:36002',
});

describe('Test transaction', function() {


  it('evaluateFee', function() {
    const sourceAddress = 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';
    const destAddress = 'ulpi3oHdLKVjCA9gdyN8rfj7Ja363qce67CAF3';

    sdk.account.getNonce(sourceAddress).then(info => {


      if (info.errorCode !== 0) {
        console.log(info);
        return;
      }
      const nonce = new BigNumber(info.result.nonce).plus(1).toString(10);

      let sendBuOperation = sdk.operation.buSendOperation({
        destAddress,
        buAmount: '60000',
        // metadata: 'oh my send bu',
      });


      if (sendBuOperation.errorCode !== 0) {
        console.log(sendBuOperation);
        return;
      }

     const operationItem = sendBuOperation.result.operation;

      // evaluation fee
      const args = {
        sourceAddress,
        nonce,
        operations: [operationItem],
        signtureNumber: '1',
        // ceilLedgerSeq: '30',
        // metadata: 'Test evaluation fee',
      };


      sdk.transaction.evaluateFee(args).then(feeData => {
        console.log(feeData)
      }).catch(err => {
        console.log(err);
      });

    }).catch(err => {
      console.log(err);
    });
  });

  it('test getInfo', function() {
    const hash = '99d4a81d811196229c4c0bdc3ad48596cc54bb7bd995aa5ac7f19ff732bca02f';

    sdk.transaction.getInfo(hash).then(data => {

      console.log(data);
    })


  });

  it('transaction', function() {
    const privateKey = 'privByFwi1dmPFvcXBTAo8Zw6pNEjpMRWxVRgXGE622EpuKwWk3HZw5F';
    const sourceAddress = 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';
    const destAddress = 'ulpi3h5Ymv33njwCcX8YGu3eJ39baKSX52rVnS';

    co(function* () {
      const result = yield sdk.account.getNonce(sourceAddress);

      if (result.errorCode !== 0) {
        console.log(result);
        return;
      }
      let nonce = result.result.nonce;
      nonce = new BigNumber(nonce).plus(1).toString(10);

      // 1.build operation
      let sendBuInfo = sdk.operation.buSendOperation({
        // sourceAddress,
        destAddress,
        buAmount: '10000000',
        // metadata: 'oh my send bu',
      });

      if (sendBuInfo.errorCode !== 0) {
        console.log(sendBuInfo);
        return;
      }

      const sendBuOperation = sendBuInfo.result.operation;
      // console.log(sendBuOperation);
      // return;
      // evaluation fee
      // const args = {
      //   sourceAddress,
      //   nonce,
      //   operations: [sendBuOperation],
      //   signtureNumber: '100',
      //   // metadata: 'Test evaluation fee',
      // };
      //
      // let feeData = yield sdk.transaction.evaluateFee(args);
      //
      // if (feeData.errorCode !== 0) {
      //   console.log(feeData);
      //   return;
      // }
      // const feeLimit = feeData.result.feeLimit;
      // const gasPrice = feeData.result.gasPrice;

      // 2. build blob
      let blobInfo = sdk.transaction.buildBlob({
        sourceAddress,
        gasPrice: '1000',
        feeLimit: '14119000',
        nonce,
        // ceilLedgerSeq: '',
        operations: [ sendBuOperation ],
        // metadata: '6f68206d79207478',
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
        signatureInfo.errorCode.should.equal(11058);
        // console.log(signatureInfo);
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
