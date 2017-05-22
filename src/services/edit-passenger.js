/**
 * 旅客操作接口
 */
import { request } from '../utils/RequestUtil';

/**
 * 添加候补旅客
 * @param params
 * @returns {*} Msg
 */
export async function addDomesticPassenger(params) {
  const paras = { ...params, type: 'addDomestic' };
  return await request('/passenger/savePassenger', {
    method: 'post',
    data: paras,
  });
}

export async function addInternationalPassenger(params) {
  const paras = { ...params, type: 'addInternational' };
  return await request('/passenger/savePassenger', {
    method: 'post',
    data: paras,
  });
}
/**
 * 修改旅客电话
 * @param params
 * @returns {Promise.<*>}
 */
export async function updatePhone(params) {
  const paras = { ...params, type: 'updatePhone' };
  return await request('/passenger/updatePassenger', {
    method: 'post',
    data: paras,
  });
}
export async function updateInterPas(params) {
  const paras = { ...params, type: 'updateInterPas' };
  return await request('/passenger/updatePassenger', {
    method: 'post',
    data: paras,
  });
}
/**
 * 修改电子客票
 * @param params
 * @returns {Promise.<*>}
 */
export async function updateElecTicket(params) {
  const paras = { ...params, type: 'updateElecTicket' };
  return await request('/passenger/updatePassenger', {
    method: 'post',
    data: paras,
  });
}

export async function updateProtectPas(params) {
  return await request('/passenger/updateProtectPas', {
    method: 'post',
    data: params,
  });
}

export async function updatePasPosition(params) {
  const paras = { ...params, type: 'updatePasPosition' };
  return await request('/passenger/updatePassenger', {
    method: 'post',
    data: paras,
  });
}
export async function updatePasType(params) {
  const paras = { ...params, type: 'updatePasType' };
  return await request('/passenger/updatePassenger', {
    method: 'post',
    data: paras,
  });
}
export async function updateGatePas(params) {
  const paras = { ...params, type: 'updateGatePas' };
  return await request('/passenger/updatePassenger', {
    method: 'post',
    data: paras,
  });
}
export async function updateBrushDocumentPas(params) {
  const paras = { ...params, type: 'updateBrushDocumentPas' };
  return await request('/passenger/updatePassenger', {
    method: 'post',
    data: paras,
  });
}

export async function FlightCheckIn(params) {
  return await request('/passenger/checkIn', {
    method: 'post',
    data: params,
  });
}

export async function cancelInterceptionPas(params) {
  return await request('/passenger/cancelInterceptionPas', {
    method: 'post',
    data: params,
  });
}

