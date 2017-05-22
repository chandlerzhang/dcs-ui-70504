import { expect } from 'chai';
import * as SyncService from '../services/sync-service';
import * as DbUtil from '../utils/DbUtil';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('user service', () => {
  before(() => {
    DbUtil.loadDbForTest();
  });

  it('sync data', async () => {
    const res = await SyncService.syncServerData();
    console.log(res);
    expect(res.success).to.be.equals(true);

    const r = await SyncService.mergeSyncData(res.obj);
    console.log(r);
  });

  it('gen sync param async/await', async () => {
    const p = await SyncService.genSyncParams();
    console.log(p);
  });
});
