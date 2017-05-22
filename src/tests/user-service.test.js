import { expect } from 'chai';
import * as UserServcie from '../services/user-service';
import * as DbUtil from '../utils/DbUtil';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('user service', () => {
  before(() => {
    DbUtil.loadDbForTest();
  });

  it('login', async () => {
    const params = {
      wid: '000001',
      pwd: '000000',
      tos: 'zha',
      fn: '9c8896',
      fde: '11dec',
    };

    const res = await UserServcie.login(params);

    console.log(res);
    expect(res.success).to.be.equals(true);
  });


  it('logout', async () => {
    const r = await UserServcie.logout();
    console.log(r);
    expect(r.success).to.be.equals(true);
  });

  it('query user', async () => {
    const users = await UserServcie.query('sha');
    console.log(users);
    expect(users).to.have.length.of.at.least(1);
  });
});
