'use strict';

require('chai').should();
const BigNumber = require('bignumber.js');
const co = require('co');

const BumoSDK = require('../index');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
  // host: '192.168.1.34:36002',
});

describe('Test create contract account transaction', function() {


  it('test create contract account ', async() => {
    console.log('==============================');
    const privateKey = 'privByFwi1dmPFvcXBTAo8Zw6pNEjpMRWxVRgXGE622EpuKwWk3HZw5F';
    const sourceAddress = 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';

    console.log('==============================');
    console.log('sourceAddress: ', sourceAddress);
    let result = await sdk.account.getNonce(sourceAddress);
    console.log('sourceAddress: ', sourceAddress);
    console.log('==============================');
    console.log('result: ', result);

    if (result.errorCode !== 0) {
      console.log(result);
      return;
    }
    let nonce = result.result.nonce;

    nonce = new BigNumber(nonce).plus(1).toString(10);
    let contractCreateOperation = sdk.operation.contractCreateOperation({
      sourceAddress,
      initBalance: '100000000',
      //type: 0,
      payload: `
          "use strict";
          function init(bar)
          {
            return;
          }

          function main(input)
          {
            return;
          }
        `,
      initInput: 'aaaaa',
      // metadata: 'Test contract create operation',
    });

    if (contractCreateOperation.errorCode !== 0) {
      console.log(contractCreateOperation);

      return;
    }

    const operationItem = contractCreateOperation.result.operation;
    console.log(operationItem);
    // const args = {
    //   sourceAddress,
    //   nonce,
    //   operations: [operationItem],
    //   //signtureNumber: '100',
    //   // metadata: 'Test evaluation fee',
    // };
    //
    // let feeData = await sdk.transaction.evaluateFee(args);
    // if (feeData.errorCode !== 0) {
    //   console.log(feeData);
    //   return;
    // }
    //
    // let feeLimit = feeData.result.feeLimit;
    // let gasPrice = feeData.result.gasPrice;
    let feeLimit = '1000';
    let gasPrice = '1000';
    console.log(feeLimit);
    console.log(gasPrice);

    // 2. build blob
    let blobInfo = sdk.transaction.buildBlob({
      sourceAddress: sourceAddress,
      gasPrice,
      feeLimit,
      nonce: nonce,
      operations: [ operationItem ],
    });
    console.log(blobInfo.result.transactionBlob);
    console.log('33');
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
    console.log('44');
    if (signatureInfo.errorCode !== 0) {
      console.log(signatureInfo);
      return;
    }
    console.log(signatureInfo);
    console.log(signatureInfo.result.signatures);

    let signature = signatureInfo.result.signatures;
    // 4. submit transaction
    let transactionInfo = await sdk.transaction.submit({
      blob,
      signature: signature,
    });
    console.log('55');
    console.log(transactionInfo);

  });


});
