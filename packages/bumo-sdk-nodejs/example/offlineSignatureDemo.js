'use strict';

require('chai').should();
const BumoSDK = require('bumo-sdk');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
});

describe('The demo of offline signature', function() {

  // ====================================
  // Take `buSendOperation` as an example
  // Offline signature contains 2 steps:
  // step1. Get blob
  // step2. Sign blob with sender private key
  // ====================================
  it('The demo of offline signature', async() => {
    const senderPrivateKey = 'privByFwi1dmPFvcXBTAo8Zw6pNEjpMRWxVRgXGE622EpuKwWk3HZw5F';
    const senderAddress = 'buQavuuHbqQz1Uc7kpY9zWLGup9GuoBLd5g8';
    const receiverAddress = 'buQsBMbFNH3NRJBbFRCPWDzjx7RqRc1hhvn1';
    // The unit is MO
    const gasPrice = '1000';
    // The unit is MO
    const feeLimit = '306000';
    // The unit is MO
    const buAmount = '7000';
    // Transaction initiation account's Nonce + 1
    const nonce = '10';
    const metadata = 'send bu demo';

    // build operation (buSendOperation)
    const operationInfo = sdk.operation.buSendOperation({
      sourceAddress: senderAddress,
      destAddress: receiverAddress,
      buAmount,
      metadata,
    });

    if (operationInfo.errorCode !== 0) {
      console.log(operationInfo);
      return;
    }

    const operationItem = operationInfo.result.operation;

    // ====================================
    // step1. Get blob
    // ====================================
    const blobInfo = sdk.transaction.buildBlob({
      sourceAddress: senderAddress,
      gasPrice,
      feeLimit,
      nonce,
      operations: [ operationItem ],
    });

    if (blobInfo.errorCode !== 0) {
      console.log(blobInfo);
      return;
    }

    const blob = blobInfo.result.transactionBlob;

    // ====================================
    // step2. Sign blob with sender private key
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

    console.log(signature);
  });

});
