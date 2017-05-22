import { expect } from 'chai';
import * as ChargeServcie from '../services/charge-service';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('fee service', () => {
  it('addFastBording', async () => {
    const params = {
      pasLegUid: '6268712075023880202',
      // pasLegUid: '6268712070670193615',
      charge: 5,
    };
    // const result = yield call(addDomesticPassenger,params)
    // console.log(result);
    const res = await ChargeServcie.addFastBording(params);
    console.log(res);
  });

  it('addOverWeight', async () => {
    const params = {
      pasLegUid: '6268712075023880202',
      // pasLegUid: '6268712070670193615',
      shoudFirst: 40,
      actualFirst: 30,
      overWeightUnitPrice: 10,
      overWeight: 20,
    };
    // const result = yield call(addDomesticPassenger,params)
    // console.log(result);
    const res = await ChargeServcie.addOverWeight(params);
    console.log(res);
  });

  it('addfastBording', async () => {
    const params = {
      pasLegUid: '6268712075023880202',
      // pasLegUid: '6268712070670193615',
      charge: 20,
    };
    // const result = yield call(addDomesticPassenger,params)
    // console.log(result);
    const res = await ChargeServcie.addFastBording(params);
    console.log(res);
  });
});
