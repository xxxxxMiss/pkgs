'use strict';

require('chai').should();
const BigNumber = require('bignumber.js');
const encryption = require('bumo-encryption');
const BumoSDK = require('bumo-sdk');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
});

describe('The demo of atp10Token', function() {

  // IssueUnlimitedAtp10Token, The totalSupply must be smaller than and equal
  // to 0
  it('IssueUnlimitedAtp10Token', async() => {
    const issuerPrivateKey = "privBv9aME3VuPqVWz4ruHxpnFMfU1kf6W3ktYkcfpse4FUZCBePZqYr";
    const senderAddress = "ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh";
    // The token name
    const name = 'TEST1';
    // The token total supply number
    const totalSupply = 0;
    // The token now supply number
    const nowSupply = '1000000000';
    // The token decimals
    const decimals = 0;
    // Description
    const description = 'test unlimited issuance of apt1.0 token';
    // The operation notes
    const metadata = 'test the unlimited issuance of apt1.0 token';
    // the unit is MO
    const gasPrice = '1000';
    // feeLimit, the unit is MO
    const feeLimit = '5003000000';
    // Transaction initiation account's Nonce + 1
    const accountInfo = await sdk.account.getNonce(senderAddress);
    console.log(accountInfo);
    if (accountInfo.errorCode !== 0) {
      return;
    }
    let nonce = accountInfo.result.nonce;

    // nonce + 1
    nonce = new BigNumber(nonce).plus(1).toString(10);

    // Get the account address
    const issuerAddresss = getAddressByPrivateKey(issuerPrivateKey);

    const atp10TokenMetadata = {
      version: '1.0',
      name,
      totalSupply,
      decimals,
      description,
    };

    // Build operation
    const operation = sdk.operation.assetIssueOperation({
      sourceAddress: issuerAddresss,
      code: atp10TokenMetadata.name,
      assetAmount: nowSupply,
      metadata,
    });

    if (operation.errorCode === 0) {
      let args = {
        privateKey: issuerPrivateKey,
        sourceAddress: issuerAddresss,
        gasPrice,
        feeLimit,
        nonce,
        operation,
        metadata: atp10TokenMetadata,
      };
      const result = await submitTransaction(args);
      console.log(result);
    }
  });

  // IssuelimitedAtp10Token,  The totalSupply must be bigger than 0
  it('IssuelimitedAtp10Token', async() => {
    const issuerPrivateKey = "privByFwi1dmPFvcXBTAo8Zw6pNEjpMRWxVRgXGE622EpuKwWk3HZw5F";
    const senderAddress = "ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh";
    // The token name
    const name = 'TXT';
    // The token total supply number
    const totalSupply = 1000000000;
    // The token now supply number
    const nowSupply = '1000000000';
    // The token decimals
    const decimals = 8;
    // Description
    const description = 'test limited issuance of apt1.0 token';
    // The operation notes
    const metadata = 'test the limited issuance of apt1.0 token';
    // The fixed write 1000, the unit is MO
    const gasPrice = '1000';
    // feeLimit, the unit is MO
    const feeLimit = '5001000000';
    // Transaction initiation account's Nonce + 1
    const accountInfo = await sdk.account.getNonce(senderAddress);
    console.log(accountInfo);
    if (accountInfo.errorCode !== 0) {
      return;
    }
    let nonce = accountInfo.result.nonce;

    // nonce + 1
    nonce = new BigNumber(nonce).plus(1).toString(10);

    // Get the account address
    const issuerAddresss = getAddressByPrivateKey(issuerPrivateKey);

    const atp10TokenMetadata = {
      version: '1.0',
      name,
      totalSupply,
      decimals,
      description,
    };
    // Build operation
    const operation = sdk.operation.assetIssueOperation({
      sourceAddress: issuerAddresss,
      code: atp10TokenMetadata.name,
      assetAmount: nowSupply,
      metadata,
    });

    if (operation.errorCode === 0) {
      let args = {
        privateKey: issuerPrivateKey,
        sourceAddress: issuerAddresss,
        gasPrice,
        feeLimit,
        nonce,
        operation,
        metadata: atp10TokenMetadata,
      };
      const result = await submitTransaction(args);
      console.log(result);
    }
  });


  it('SendAtp10Token', async() => {
    // The account private key to send atp1.0 token
    const senderPrivateKey = "privByFwi1dmPFvcXBTAo8Zw6pNEjpMRWxVRgXGE622EpuKwWk3HZw5F";
    const senderAddress = "ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh";
    // The account that issued the atp 1.0 token
    const issuerAddress = "";
    // The account to receive atp 1.0 token
    const destAddress = "ulpi3oHdLKVjCA9gdyN8rfj7Ja363qce67CAF3";
    // The token code
    const code = "TEST1";
    // The token amount to be sent
    const amount = '1000000000';
    // The operation notes
    const metadata = "test one off issue apt1.0 token";
    // the unit is MO
    const gasPrice = '1000';
    // maximum cost, the unit is MO
    const feeLimit = '1000000';
    // Transaction initiation account's Nonce + 1
    const accountInfo = await sdk.account.getNonce(senderAddress);
    console.log(accountInfo);
    if (accountInfo.errorCode !== 0) {
      return;
    }
    let nonce = accountInfo.result.nonce;

    // nonce + 1
    nonce = new BigNumber(nonce).plus(1).toString(10);
    // Get the account address
    const senderAddresss = getAddressByPrivateKey(senderPrivateKey);
    // Check whether the destination account is activated
    let status = await checkAccountStatus(destAddress);

    if  (!status) {
      let accountInfo = await accountActivate({
        privateKey: senderPrivateKey,
        sourceAddress: senderAddresss,
        destAddress: destAddress,
        nonce: '22',
      });
    }

    const operation = sdk.operation.assetSendOperation({
      sourceAddress: senderAddresss,
      destAddress: destAddress,
      code: code,
      issuer: senderAddresss,
      assetAmount: amount,
      metadata: metadata,
    });

    if (operation.errorCode === 0) {
      let args = {
        privateKey: senderPrivateKey,
        sourceAddress: senderAddresss,
        gasPrice,
        feeLimit,
        nonce,
        operation,
      };
      const result = await submitTransaction(args);
      console.log(result);
    }

  });

  // Check account status
  async function checkAccountStatus(address) {
    const data = await sdk.account.isActivated(address);
    return data.result.isActivated;
  }

  // Activate account
  async function accountActivate(args) {
    let operation = sdk.operation.accountActivateOperation({
      destAddress: args.destAddress,
      initBalance: '1000000',
    });

    const result = await submitTransaction({
      privateKey: args.privateKey,
      sourceAddress: args.sourceAddress,
      gasPrice: '1000',
      feeLimit: '1000000',
      nonce: args.nonce,
      operation,
    });

    return result.errorCode === 0;
  }

  // Get address from private key
  function getAddressByPrivateKey(privatekey) {
    const KeyPair = encryption.keypair;
    let publicKey = KeyPair.getEncPublicKey(privatekey);
    return KeyPair.getAddress(publicKey);
  }

  // Submit
  async function submitTransaction(args) {
    // 1. Build Operation
    const operationItem = args.operation.result.operation;

    let opt = {
      sourceAddress: args.sourceAddress,
      gasPrice: args.gasPrice,
      feeLimit: args.feeLimit,
      nonce: args.nonce,
      operations: [ operationItem ],
    };

    if (args.metadata) {
      opt.metadata = JSON.stringify(args.metadata);
    }

    // 2. Build blob
    let blobInfo = sdk.transaction.buildBlob(opt);

    if (blobInfo.errorCode !== 0) {
      console.log(blobInfo);
      return;
    }

    let blob = blobInfo.result.transactionBlob;

    // 3. Sign blob
    let signatureInfo = sdk.transaction.sign({
      privateKeys: [ args.privateKey ],
      blob,
    });

    if (signatureInfo.errorCode !== 0) {
      console.log(signatureInfo);
      return;
    }

    let signature = signatureInfo.result.signatures;
    // 4. Submit transaction
    return await sdk.transaction.submit({
      blob,
      signature: signature,
    });
  }

});
