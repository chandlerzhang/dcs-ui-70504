import { expect } from 'chai';
import * as EditPassengerServcie from '../services/edit-passenger';
// import * as DbUtil from '../utils/DbUtil';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('editpassenger service', () => {
  it('addPassenger', async () => {
    const params = {
      cnname: '李四',
      docNum: 'S111', // 证件号码
      pasType: '成人', // 旅客性质
      bagFreeWeight: '19', // 免费行李重量
      whrElecTicket: 'false', // 是否电子票
      stationDestn: 'cju', // 目的站
      stationStart: 'pvg', // 始发站
      flightNum: '9c8567', // 航班号
      flightDate: '2016-11-11', // 航班日期
      legUid: 6268039917280957316, //航班uui
    };
    const res = await EditPassengerServcie.addDomesticPassenger(params);
    console.log(res);
    expect(res.success).to.be.equals(true);
  });

  it('updateElecPassenger', async () => {
    const params = {
      whrElecTicket: 'false',
      uniqueId: '6268321573522903040', //旅客uui
    };
    const res = await EditPassengerServcie.updateElecTicket(params);
    console.log(res);
    // expect(res.success).to.be.equals(true);
  });


  it('update-phone', async () => {
    const params = {
      tel: '110110110', // 电话
      uniqueId: '6268321573522903040', //旅客uui
    };
    const res = await EditPassengerServcie.updatePhone(params);
    console.log(res);
    // expect(res.success).to.be.equals(true);
  });

  it('update-PasPosition', async () => {
    const params = {
      orderSeatRank: 'r4', // 仓位
      uniqueId: '6268321573522903040', //旅客uui
    };
    const res = await EditPassengerServcie.updatePasPosition(params);
    console.log(res);
    // expect(res.success).to.be.equals(true);
  });
  it('update-GatePas', async () => {
    const params = {
      whrStop: 'false', // 是否截留
      uniqueId: '6268321573522903040', //旅客uui
    };
    const res = await EditPassengerServcie.updateGatePas(params);
    console.log(res);
    // expect(res.success).to.be.equals(true);
  });
  it('update-pastype', async () => {
    const params = {
      pasType: '儿童', // 仓位
      uniqueId: '6268321573522903040', //旅客uui
    };
    const res = await EditPassengerServcie.updatePasType(params);
    console.log(res);
    // expect(res.success).to.be.equals(true);
  });


  it('update-BrushDocumentPas', async () => {
    const params = {
      cnname: '隔壁',
      docNum: '6666', // 证件号码
      pasType: '成人', // 旅客性质
      uniqueId: '6268321573522903040', //旅客uui
    };
    const res = await EditPassengerServcie.updateBrushDocumentPas(params);
    console.log(res);
    // expect(res.success).to.be.equals(true);
  });

  it('update-protectPassenger', async () => {
    const params = {
     // passes: [{ uui: '6268321573522903040' }, { uui: '6268321573522903040' }], // 旅客uui
      flightNum: '9c8567', // 航班号
      flightDate: '2016-11-11', // 航班日期
      ids: ['1', '2'],
    };
    const res = await EditPassengerServcie.updateProtectPas(params);
    console.log(res);
    // expect(res.success).to.be.equals(true);
  });
});
