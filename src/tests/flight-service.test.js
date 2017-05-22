import {expect} from 'chai';
import * as FlightServcie from '../services/flight-service';
import * as DbUtil from '../utils/DbUtil';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('Flightflight service', () => {
  before(() => {
    DbUtil.loadDbForTest();
  });
  it('queryFlightForLogin', async() => {
    const params = {
      tos: 'zha',
      fn: '9c8567',
      fde: '05dec',
    };
    const promise = await FlightServcie.queryFlightForLogin(params);
    console.info(promise);

  });

  it('query flight by fn', async() => {
    const flights = await FlightServcie.queryFlight({fn: '9C8896', len: 1});
    console.log(flights)
  });

  it('query flightInfoStatistics', async() => {
    const flights = await FlightServcie.flightInfoStatistics({uui: '6268272105503068364'}, 'alt+d');
    console.log(flights)
  });

  it('query flight by flu', async() => {
    const flights = await FlightServcie.queryFlight({flu: 'qweqdad564a5s4d545', len: 1});
    console.log(flights)
  });

  it('query flight bymfn', async() => {
    const flights = await FlightServcie.queryFlight({mfn: '9C8896', len: 1});
    console.log(flights)
  });

  it('query flight by fn and fd', async() => {
    const flights = await FlightServcie.queryFlight({fn: '9C8896', fd: '170506', len: 2});
    console.log(flights)
  });

  it('query flight by fn and fd and sd', async() => {
    const flights = await FlightServcie.queryFlight({fn: '9c9000', fd: '170506', sd: 'pvg', len: 3});
    console.log(flights)
  });
});
