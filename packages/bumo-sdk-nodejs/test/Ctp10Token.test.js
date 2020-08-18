'use strict';

require('chai').should();
const BumoSDK = require('../index');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
});

describe('Test token.ctp10Token', function() {

  it('test token.ctp10Token.checkValid()', async() => {
    let address = 'ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom';
    let data = await sdk.token.ctp10Token.checkValid(address);
    console.log(data);
    data.result.isValid.should.equal(true);
    address = '2312412414';
    data = await sdk.token.ctp10Token.checkValid(address);
    data.errorCode.should.equal(11037)
  });


  it('test token.ctp10Token.getInfo()', async() => {
    let address = 'ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom';
    let data = await sdk.token.ctp10Token.getInfo(address);
    console.log(data);
  });

  it('test token.ctp10Token.getName()', async() => {
    let address = 'ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom';
    let data = await sdk.token.ctp10Token.getName(address);
    console.log(data);
  });

  it('test token.ctp10Token.getSymbol()', async() => {
    let address = 'ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom';
    let data = await sdk.token.ctp10Token.getSymbol(address);
    console.log(data);
  });

  it('test token.ctp10Token.getDecimals()', async() => {
    let address = 'ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom';
    let data = await sdk.token.ctp10Token.getDecimals(address);
    console.log(data);
  });

  it('test token.ctp10Token.getTotalSupply()', async() => {
    let address = 'ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom';
    let data = await sdk.token.ctp10Token.getTotalSupply(address);
    console.log(data);
  });

  it('test token.ctp10Token.getBalance()', async() => {
    let data = await sdk.token.ctp10Token.getBalance({
      contractAddress: 'ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom',
      tokenOwner: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
    });
    data.errorCode.should.equal(0);

    data = await sdk.token.ctp10Token.getBalance({
      contractAddress: 'ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom',
      tokenOwner: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
    });
    data.errorCode.should.equal(11030);

    data = await sdk.token.ctp10Token.getBalance({
      contractAddress: 'ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom',
      tokenOwner: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
    });
    data.errorCode.should.equal(11037);

    data = await sdk.token.ctp10Token.getBalance({
      contractAddress: '',
      tokenOwner: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
    });
    data.errorCode.should.equal(11037);

    data = await sdk.token.ctp10Token.getBalance({
      contractAddress: 'ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom',
      tokenOwner: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
    });
    data.errorCode.should.equal(11035);

  });

  it('test token.ctp10Token.allowance()', async() => {

    let data = await sdk.token.ctp10Token.allowance({
      contractAddress: 'ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom',
      tokenOwner: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      spender: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
    });
    console.log(data);
  });


});
