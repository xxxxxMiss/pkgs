'use strict';

require('chai').should();
const BumoSDK = require('../index');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
});

describe('Test contract create operation', function() {

  it('test operation.contractCreateOperation()', function() {

    let contractCreateOperation = sdk.operation.contractCreateOperation({
      sourceAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      initBalance: '1000',
      type: 0,
      payload: 'afasfsaff',
      initInput: 'aaaaa',
      metadata: 'Test contract create operation',
    });

    if (contractCreateOperation.errorCode !== 0) {
      console.log(contractCreateOperation);
      return;
    }

    const operationItem = contractCreateOperation.result.operation;

    const blobInfo = sdk.transaction.buildBlob({
      sourceAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      gasPrice: '1000',
      feeLimit: '1000000',
      nonce: '123',
      operations: [ operationItem ],
    });

    console.log(blobInfo);
  });

});
