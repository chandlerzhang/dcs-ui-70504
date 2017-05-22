/**
 * Created by 010794 on 2017/5/9.
 */
import { expect } from 'chai';
import * as LogService from '../services/log-service';
import * as DbUtil from '../utils/DbUtil';


describe('logService', () => {
  before(() => {
    DbUtil.loadDbForTest();
  });

// 查询商务行李信息
  it('queryBusinessBag', () => {
    const businessBag = LogService.query('/baglsb');
    console.info(businessBag);
    expect(businessBag).to.have.length.of.at.least(1);
  });

  // 查询航班和商务行李信息
  it('queryLog', () => {
    const logs = LogService.query('/log');
    console.info(logs);
  });

  // 查询操作人操作日志
  it('queryByLmb', () => {
    const lmbLogs = LogService.query('/opr0001');
    console.info(lmbLogs);
  });

  // 查询系统日志
  it('querySysLog', () => {
    const syslogs = LogService.querySysLog('/syslog');
    console.info(syslogs);
  });

  // 查询旅客日志
  it('queryPassengerLogs', () => {
    const plus = [1, 2, 3];
    const passengerLogs = LogService.queryPassengerLogs(plus);
    console.info(passengerLogs);
  });

  it('test', () => {
    const array = [1, 2, 3];
    const s = LogService.query(null, array);
    console.info(s);
  });
});
