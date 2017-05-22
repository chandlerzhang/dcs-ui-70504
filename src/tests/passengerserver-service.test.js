// import { expect } from 'chai';
import * as passengerServer from '../services/passengerserver-service';
import * as DbUtil from '../utils/DbUtil';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('passengerserver service', () => {
  before(() => {
    DbUtil.loadDbForTest();
  });
  /**
   * 旅客服务查询
   */
  it('passengerserver passQueryServer', () => {
    const passengerServerView = passengerServer.passQueryServer('6268272188860666623');
    console.log(passengerServerView);
  });
  /**
   * 旅客服务更新操作
   */
  it('updatePassengerServer', async () => {
    const params = {
      uui: '6270117564676837554',
      passengerServer: 'ROSE,VIP',
    };
    const res = await passengerServer.updatePassengerServer(params);
    // expect(res.success).to.be.equals(true);
    console.log(res);
  });
});

