import { expect } from 'chai';
import * as notifyService from '../services/notify-service';
import * as DbUtil from '../utils/DbUtil';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('notify service', () => {
  before(() => {
    DbUtil.loadDbForTest();
  });

  it('query all notify', () => {
    const allNotify = notifyService.queryAllNotify();
    expect(allNotify).to.have.length.of.at.least(1);
    console.log(allNotify);
  });

  it('query airport notify', () => {
    const airportNotify = notifyService.queryAirportNotify('pvg');
    expect(airportNotify).to.have.length.of.at.least(1);
    console.log(airportNotify);
  });

  it('query flight notify', () => {
    const flightNotify = notifyService.queryFlightNotify('6267260153649696955');
    expect(flightNotify).to.have.length.of.at.least(1);
    console.log(flightNotify);
  });

  it('query pasLeg notify', () => {
    const pasLegNotify = notifyService.queryPasLegNotify('6267261066263138889');
    expect(pasLegNotify).to.have.length.of.at.least(1);
    console.log(pasLegNotify);
  });
});
