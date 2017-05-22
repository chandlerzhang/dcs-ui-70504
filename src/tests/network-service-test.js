import { expect } from 'chai';
import * as NetworkService from '../services/network-service';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('network service', () => {
  before(() => {
    // DbUtil.loadDbForTest();
  });

  it('turn offline', async () => {
    const reslut = await NetworkService.turnOffline('pvg');
    console.log(reslut);
    expect(reslut).to.be.not.null;
  });

  it('turn online', async () => {
    const reslut = await NetworkService.turnOnline('pvg');
    console.log(reslut);
    expect(reslut).to.be.not.null;
  });
});
