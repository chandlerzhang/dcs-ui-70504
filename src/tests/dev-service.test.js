import { expect } from 'chai';
import * as DevService from '../services/dev-service';
import * as DbUtil from '../utils/DbUtil';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('user service', () => {
  before(() => {
    // DbUtil.loadDbForTest();
  });

  it('query devices', async () => {
    const r = await DevService.query();

    console.log(r);
    expect(r.success).to.be.equals(true);
  });

  it('update counter name and enable devices', async () => {
    const r = await DevService.updateCounter(402, [43]);
    console.log(r);
    expect(r.success).to.be.equals(true);
  });
});
