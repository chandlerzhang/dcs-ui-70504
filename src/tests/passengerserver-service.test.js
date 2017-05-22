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
    const passengerServerView = passengerServer.passQueryServer('6266195209642578431');
    console.log(passengerServerView);
  });
  /**
   * 旅客服务更新操作
   */
  it('updatePassengerServer', async () => {
    const uui = '6268272188864860932'; // 旅客uui
    const pasService = 'ROSE,VIP'; // 旅客服务信息
    const res = await passengerServer.updatePassengerServer(uui, pasService);
    // expect(res.success).to.be.equals(true);
    console.log(res);
  });
});

