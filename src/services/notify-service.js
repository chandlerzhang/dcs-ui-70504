/**
 * 离港通知相关接口
 */

import { queryForList } from '../utils/DbUtil';

/**
 * 查询所有离港通知消息
 * @returns []
 */
export function queryAllNotify() {
  const querySql = 'select * from dcs_notify where wde = ?';
  const notify = queryForList(querySql, [0]);
  return notify;
}

/**
 * 查询航班通知消息
 * @param lu 航班航段UUI
 * @returns []
 */
export function queryFlightNotify(lu) {
  const querySql = 'select * from dcs_notify where wde = ? and lu = ?';
  const notify = queryForList(querySql, [0, lu]);
  return notify;
}

/**
 * 查询机场通知消息
 * @param airportCode 机场三字码
 * @returns []
 */
export function queryAirportNotify(airportCode) {
  const querySql = 'select * from dcs_notify where wde = ? and air = ?';
  const notify = queryForList(querySql, [0, airportCode]);
  return notify;
}

/**
 * 查询旅客通知消息
 * @param plu 旅客航段UUI
 * @returns []
 */
export function queryPasLegNotify(plu) {
  const querySql = 'select * from dcs_notify where wde = ? and plu = ?';
  const notify = queryForList(querySql, [0, plu]);
  return notify;
}
