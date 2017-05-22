import { expect } from 'chai';
import * as passengerServcie from '../services/passenger-service';
import * as DbUtil from '../utils/DbUtil';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('passenger service', () => {
  before(() => {
    DbUtil.loadDbForTest();
  });

  it('passengerView oa', () => { // 显示仓位旅客oa/ob/oc
    const passengers = passengerServcie.queryPassenger('/oa', '6266195209642578431');
    expect(passengers).to.have.length.of.at.least(4);
    console.log(passengers);
  });
  it('passengerView na', () => {
    // const passengers = passengerServcie.queryPassenger('/na', '6266195209642578431');
    // expect(passengers).to.have.length.of.at.least(12);
    const passengers = passengerServcie.queryPassenger('/na', '6268272110334906753');
    expect(passengers).to.have.length.of.at.least(5);
    console.log(passengers);
  });
  it('passengerView al', () => {
    // const passengers = passengerServcie.queryPassenger('/al', '6266195209642578431');
    // expect(passengers).to.have.length.of.at.least(12);
    const passengers = passengerServcie.queryPassenger('/al hsg', '6266195209642578431');
    expect(passengers).to.have.length.of.at.least(8);
    console.log(passengers);
  });
  it('passengerView ac', () => {
    // const passengers = passengerServcie.queryPassenger('/ac', '6266195209642578431');
    // expect(passengers).to.have.length.of.at.least(12);
    const passengers = passengerServcie.queryPassenger('/ac', '6268272110334906753');
    expect(passengers).to.have.length.of.at.least(1);
    console.log(passengers);
  });
  // 根据证件号提取旅客
  it('passengerView idcard', () => {
    // const passengers = passengerServcie.queryPassenger('/idcard:','6266195209642578431');
    // expect(passengers).to.have.length.of.at.least(0);
    const passengers = passengerServcie.queryPassenger('/idcard:', '6266195209642578431', 'hsg');
    expect(passengers).to.have.length.of.at.least(2);
    console.log(passengers);
  });
  // del：查询已经办理退票手续的旅客名单
  it('passengerView del', () => {
    // const passengers = passengerServcie.queryPassenger('/del hsg:', '6266195209642578431');
    // expect(passengers).to.have.length.of.at.least(0);
    const passengers = passengerServcie.queryPassenger('/del', '6266195209642578431');
    expect(passengers).to.have.length.of.at.least(1);
    console.log(passengers);
  });
  // =：姓名模糊查询
  it('passengerView byname', () => {
    const passengers = passengerServcie.queryPassenger('/byname:YEJIE', '6266195209642578431');
    expect(passengers).to.have.length.of.at.least(1);
    console.log(passengers);
  });
  // 根据行李号提取旅客
  it('passengerView bagn', () => {
    const passengers = passengerServcie.queryPassenger('/bagn', '6268272110334906753');
    expect(passengers).to.have.length.of.at.least(4);
    console.log(passengers);
  });
  // ctn：根据同行值机序号查询旅客
  it('passengerView ctn', () => {
    const passengers = passengerServcie.queryPassenger('/ctn 1', '6268272110334906753');
    expect(passengers).to.have.length.of.at.least(3);
    console.log(passengers);
  });
  // ct：查询座位冲突的旅客
  it('passengerView ct', () => {
    const passengers = passengerServcie.queryPassenger('/psaf', '6268272105503068364');
    expect(passengers).to.have.length.of.at.least(0);
    console.log(passengers);
  });
});

