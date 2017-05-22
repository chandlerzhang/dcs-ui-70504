/**
 * 座位服务测试
 * Created by 011414 on 2017/5/16.
 */
// import { expect } from 'chai';
import * as seatService from '../services/seat-service';
import * as DbUtil from '../utils/DbUtil';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('passenger service', () => {
  before(() => {
    DbUtil.loadDbForTest();
  });

  it('seatService querySeatInfo', () => {
    const seats = seatService.querySeatInfo('6266195209642578431');
    // expect(seats).to.have.length.of.at.least(4);
    console.log(seats);
  });
  /**
   * 旅客服务更新操作
   */
  it('operateFlightSeat', async () => {
    const lu = '6270087327318544652'; // 航班lu
    const st = '-'; // 座位信息
    const startRn = 1; // 座位起始排
    const endRn = 1; // 座位结束排
    const cns = 'ab'; // 座位列
    const res = await seatService.operateFlightSeat(lu, st, startRn, endRn, cns);
    console.log(res);
    // expect(res.success).to.be.equals(true);
  });
});
