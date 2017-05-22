/**
 * 行李操作接口
 * Created by 010794 on 2017/5/12.
 */

import { expect } from 'chai';
import * as service from '../services/baggage-service';
import * as DbUtil from '../utils/DbUtil';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('baggage service', () => {
  before(() => {
    DbUtil.loadDbForTest();
  });

  it('addbaggage', async () => {
    const params = {
      plu: '6270087436995399891',
      bagNum: '666665',
      weight: 30.00,
      whrPrint: true,
      stationDestn: 'TAO',
      whrInputBagNum: true,
    };

    const promise = await service.addBaggage(params, service.BAGGAGE);
    console.info(promise);
    // expect(promise.success).to.be.equals(true);
  });

  it('addBusinessBagage', async () => {
    const params = {
      bagNum: '888888',
      weight: 20.00,
      stationDestn: 'TAO',
      whrPrint: true,
      whrInputBagNum: true,
    };

    const addBaggage = await service.addBaggage(params, service.BUSINESS_BAGGAGE);
    console.info(addBaggage);
  });

  it('delBaggage', async () => {
    const bagNumArray = ['666666', '888888'];
    const params = {
      plu: '6270087436995399891',
      bagNum: bagNumArray,
    };
    const afterView = await service.delBaggage(params, service.BAGGAGE);
    console.info(afterView);
  });

  it('addBusinessBaggage', async () => {
    const bagNumArray = ['666666', '888888'];
    const params = {
      bagNum: bagNumArray,
    };
    const afterView = await service.delBaggage(params, service.BUSINESS_BAGGAGE);
    console.info(afterView);
  });
  /**
   * 查询商务行李信息
   */
  it('baggage', async () => {
    const baggage = await service.query('/bagls', '6270087327293378826');
    console.info(baggage);
  });
  /**
   * 查询旅客行李信息
   */
  it('passengerBaggage', async () => {
    const passengerBaggage = await service.query('/baglsp', '6270087327293378826');
    console.info(passengerBaggage);
  });
  /**
   * 查询商务行李信息
   */
  it('businessBaggage', async () => {
    const businessBaggage = await service.query('/baglsb', '6270087327293378826');
    console.info(businessBaggage);
  });
});
