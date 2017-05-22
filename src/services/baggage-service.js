/**
 * 行李操作接口
 * Created by 010794 on 2017/5/12.
 */

import { request } from '../utils/RequestUtil';
import { queryForList } from '../utils/DbUtil';

export const BAGGAGE = 'BAGGAGE';
export const BUSINESS_BAGGAGE = 'BUSINESS_BAGGAGE';
/**
 * 添加行李接口
 * @param params
 * @param type
 * @returns {Promise.<*>}
 */
export async function addBaggage(params, type) {
  let path;
  if (type === BAGGAGE) {
    path = '/baggage/add';
  } else if (type === BUSINESS_BAGGAGE) {
    path = '/baggage/addBusiness';
  }
  const paras = { ...params };
  console.info(path);
  return request(path, {
    method: 'post',
    data: paras,
  });
}
/**
 * 删除行李接口
 * @param params
 * @param type
 * @returns {Promise.<void>}
 */
export async function delBaggage(params, type) {
  let path;
  if (type === BAGGAGE) {
    path = '/baggage/delBaggage';
  } else if (type === BUSINESS_BAGGAGE) {
    path = '/baggage/delBusinessBaggage';
  }
  const paras = { ...params };
  console.info(path);
  return request(path, {
    method: 'post',
    data: paras,
  });
}

/**
 * 查询行李信息
 * @param cmd 操作命令
 * @param lu 航段uui
 * @returns {Promise.<void>}
 */
export async function query(cmd, lu) {
  if (cmd) {
    const sqlBusiness = "select lmb,case when wb = 1 then '商务行李' end as bagInfo,'' as can,bn,sde,sd,ct from dcs_fb where wb = 1 and lu = ?";
    const sqlPassenger = "select fb.lmb,case when fb.wb = 0 then '旅客行李' end as bagInfo,pl.cna,fb.bn,fb.sde,fb.sd,fb.ct from dcs_fb fb,dcs_pl pl where fb.wb = 0 and fb.lu = ? and fb.plu = pl.uui";
    const listBusiness = queryForList(sqlBusiness, [lu]);// 查询商务行李
    const listPassenger = queryForList(sqlPassenger, [lu]);// 查询旅客行李
    const lengthBusiness = listBusiness.length;
    const lengthPassenger = listPassenger.length;
    if (cmd === '/bagls') { // 查询所有行李信息
      listBusiness.push(...listPassenger);
      return {
        total: lengthBusiness + lengthPassenger,
        baggage: lengthBusiness,
        busiBaggage: lengthPassenger,
        lists: listBusiness,
      };
    } else if (cmd === '/baglsb') { // 查询商务行李信息
      return {
        busiBaggage: lengthBusiness,
        lists: listBusiness,
      };
    } else if (cmd === '/baglsp') { // 查询旅客行李信息
      return {
        baggage: lengthPassenger,
        lists: listPassenger,
      };
    }
  }
}

