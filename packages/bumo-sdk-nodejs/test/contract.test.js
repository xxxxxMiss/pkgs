'use strict';

require('chai').should();
const BumoSDK = require('../index');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
});

describe('Test bumo-sdk contract service', function() {

  it('test contract.getInfo()', async() => {
    let data = await sdk.contract.getInfo('ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom');
    data.errorCode.should.equal(0);
    data = await sdk.contract.getInfo('ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh');
    data.errorCode.should.equal(11038);
    data = await sdk.contract.getInfo('23131');
    data.errorCode.should.equal(11037);

    data = await sdk.contract.getInfo('ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh');
    data.errorCode.should.equal(11038);

  });

  it('test contract.checkValid()', async() => {

    let data = await sdk.contract.checkValid('ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh');
    data.errorCode.should.equal(0);
    data.result.should.be.a('object');
    data.result.isValid.should.equal(false);

    data = await sdk.contract.checkValid('ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom');
    data.errorCode.should.equal(0);
    data.result.should.be.a('object');
    data.result.isValid.should.equal(true);

    data = await sdk.contract.checkValid('1231231');
    data.errorCode.should.equal(11037);
  });

  it('test contract.getAddress()', async() => {
    let hash = 'c13a1c07b31e69ca885bf8879beaa13b19e37d6f05cb499669917db6247e70d7';
    // hash = 'buQqbhTrfAqZtiX79zp4MWwUVfpcadvtz2TMA';
    let data = await sdk.contract.getAddress(hash);
    console.log(data);
    console.log(JSON.stringify(data))
  });

  it('test contract.call()', async() => {

    let data = await sdk.contract.call({
      optType: 2,
      // code: 'leo'
      // contractAddress: 'buQVyqx5hnPPpuPdN5awWzkdaD1wKtczst8G',
      contractAddress: 'ulpi3m8niPugBi8Aq4DWNnjVUR9FL3J8Npxhom',
      input: JSON.stringify({
        // method: 'contractInfo',
        method: 'name',
      }),
    });
    console.log(JSON.stringify(data));
  });

});
