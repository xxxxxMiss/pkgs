'use strict';

require('chai').should();
const BumoSDK = require('../index');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
});

describe('Test bumo-sdk account service', function() {



  it('test account.create()', async() => {
    const keypair = await sdk.account.create();
    keypair.errorCode.should.equal(0);
    keypair.result.should.be.a('object');
    keypair.result.should.have.property('privateKey').with.lengthOf(56);
    keypair.result.should.have.property('publicKey').with.lengthOf(76);
    keypair.result.should.have.property('address').with.lengthOf(38);
  });


  it('test account.getInfo(address)', async() => {
    let address = 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';
    let data = await sdk.account.getInfo(address);
    data.should.be.a('object');
    data.errorCode.should.equal(0);

    address = '';
    data = await sdk.account.getInfo(address);
    data.should.be.a('object');
    data.errorCode.should.equal(11006);

    address = 'bumo3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';
    data = await sdk.account.getInfo(address);
    data.should.be.a('object');
    data.errorCode.should.equal(11006);

    address = 100;
    data = await sdk.account.getInfo(address);
    data.should.be.a('object');
    data.errorCode.should.equal(11006);
  });

  it('test account.checkValid(address)', async() => {
    let data = await sdk.account.checkValid('ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh');
    data.should.be.a('object');
    data.result.should.be.a('object');
    data.result.should.have.property('isValid').equal(true);

    data = await sdk.account.checkValid('bumoi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh');
    data.should.be.a('object');
    data.result.should.be.a('object');
    data.result.should.have.property('isValid').equal(false);

    data = await sdk.account.checkValid('');
    data.should.be.a('object');
    data.result.should.be.a('object');
    data.result.should.have.property('isValid').equal(false);


    data = await sdk.account.checkValid(123);
    data.should.be.a('object');
    data.result.should.be.a('object');
    data.result.should.have.property('isValid').equal(false);
  });

  it('test account.getBalance(address)', async() => {
    let address = 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';
    let data = await sdk.account.getBalance(address);
    data.should.be.a('object');
    data.errorCode.should.equal(0);
    data.result.should.have.property('balance');

    address = '';
    data = await sdk.account.getBalance(address);
    data.should.be.a('object');
    data.errorCode.should.equal(11006);

    address = '123';
    data = await sdk.account.getBalance(address);
    data.should.be.a('object');
    data.errorCode.should.equal(11006);

    address = 123;
    data = await sdk.account.getBalance(address);
    data.should.be.a('object');
    data.errorCode.should.equal(11006);
  });

  it('test account.getNonce(address)', async() => {
    let address = 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh';
    let data = await sdk.account.getNonce(address);

    data.should.be.a('object');
    data.errorCode.should.equal(0);
    data.result.should.have.property('nonce');
    console.log(data.result);

    address = '';
    data = await sdk.account.getNonce(address);
    data.should.be.a('object');
    data.errorCode.should.equal(11006);
  });

  it('test account.getMetadata()', async() => {
    let data = await sdk.account.getMetadata({
      address: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      key: 'mykey1'
    });
    console.log(data);
    console.log(JSON.stringify(data));
  });

  it('test account.isActivated()', async() => {
    let data = await sdk.account.isActivated('ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh');
    data.errorCode.should.equal(0);
    data.result.isActivated.should.equal(true);

    data = await sdk.account.isActivated('ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh');
    data.errorCode.should.equal(0);
    data.result.isActivated.should.equal(true);

    data = await sdk.account.isActivated();
    data.errorCode.should.equal(15016);

    data = await sdk.account.isActivated('');
    data.errorCode.should.equal(11006);

  });

});
