// import { expect } from 'chai';
import * as passcountServcie from '../services/passcount-service';
import * as DbUtil from '../utils/DbUtil';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('passcount service', () => {
  before(() => {
    DbUtil.loadDbForTest();
  });

  it('passcount queryManifest', () => {
    const passcount = passcountServcie.queryManifest('6266195209642578431');
    console.log(passcount);
  });
  /**
   * 查询旅客相关信息
   * 网上值机、销售合计、电子客票、候补合计
   * @param lu 航段唯一标识
   */
  it('passcount queryPlMsg', () => {
    const passcount = passcountServcie.queryPlMsg('6266195209642578431');
    console.log(passcount);
  });
  /**
   * 查询旅客相关信息
   * 值机、登机、拉下
   * @param lu
   * @returns {Array}
   */
  it('passcount queryPassenger', () => {
    const passcount = passcountServcie.queryPassenger('6266195209642578431');
    console.log(passcount);
  });
  /**
   * 查询多航段舱单数据，旅客
   * @param lu 航段唯一标识
   */
  it('passcount queryCmxPassMsg', () => {
    const passcount = passcountServcie.queryCmxPassMsg('6266195209642578431');
    console.log(passcount);
  });
});

