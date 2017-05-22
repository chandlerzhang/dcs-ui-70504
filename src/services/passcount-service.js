/**
 * 用户相关的操作接口
 */

import { queryForList } from '../utils/DbUtil';

/**
 * 舱单统计
 * @param lu 航段唯一标识
 */
export function queryManifest(lu) {
  if (lu) {
    const sql = 'select pty, sa,count(1) amount from dcs_pl  where lu =? and wc = 1 and wlo =0 group by pty,sa';
    const passengerInfos = queryForList(sql, [lu]);
    const result = { oa_adu: 0,
      oa_chd: 0,
      oa_inf: 0,
      ob_adu: 0,
      ob_chd: 0,
      ob_inf: 0,
      oc_adu: 0,
      oc_chd: 0,
      oc_inf: 0 };
    passengerInfos.forEach((pinfo) => {
      if (pinfo) {
        if (pinfo.sa === 'oa') {
          if (pinfo.pty === 'adu') result.oa_adu = pinfo.amount;
          if (pinfo.pty === 'chd') result.oa_chd = pinfo.amount;
          if (pinfo.pty === 'inf') result.oa_inf = pinfo.amount;
        }
        if (pinfo.sa === 'ob') {
          if (pinfo.pty === 'adu') result.ob_adu = pinfo.amount;
          if (pinfo.pty === 'chd') result.ob_chd = pinfo.amount;
          if (pinfo.pty === 'inf') result.ob_inf = pinfo.amount;
        }
        if (pinfo.sa === 'oc') {
          if (pinfo.pty === 'adu') result.oc_adu = pinfo.amount;
          if (pinfo.pty === 'chd') result.oc_chd = pinfo.amount;
          if (pinfo.pty === 'inf') result.oc_inf = pinfo.amount;
        }
      }
    });
    result.total_adu = result.oa_adu + result.ob_adu + result.oc_adu;
    result.total_chd = result.oa_chd + result.ob_chd + result.oc_chd;
    result.total_inf = result.oa_inf + result.ob_inf + result.oc_inf;
    return result;
  }
}
/**
 * 查询旅客相关信息
 * 网上值机、销售合计、电子客票、候补合计
 * @param lu 航段唯一标识
 */
export function queryPlMsg(lu) {
  const result = { adu_sale: 0,
    adu_et: 0,
    adu_gs: 0,
    adu_wc: 0,
    chd_sale: 0,
    chd_et: 0,
    chd_gs: 0,
    chd_wc: 0,
    inf_sale: 0,
    inf_et: 0,
    inf_gs: 0,
    inf_wc: 0 };
  if (lu) {
    const sql = 'select * from dcs_pl where lu=? and wde=0';
    const passengerInfos = queryForList(sql, [lu]);
    passengerInfos.forEach((pssInfo) => {
      if (pssInfo.pty === 'adu') {
        result.adu_sale += 1;
        if (pssInfo.wet === 1) result.adu_et += 1;
        if (pssInfo.wgs === 1) result.adu_gs += 1;
        if (pssInfo.wc === 1 && pssInfo.cs >= 500) result.adu_wc += 1;
      }
      if (pssInfo.pty === 'chd') {
        result.chd_sale += 1;
        if (pssInfo.wet === 1) result.chd_et += 1;
        if (pssInfo.wgs === 1) result.chd_gs += 1;
        if (pssInfo.wc === 1 && pssInfo.cs >= 500) result.chd_wc += 1;
      }
      if (pssInfo.pty === 'inf') {
        result.inf_sale += 1;
        if (pssInfo.wet === 1) result.inf_et += 1;
        if (pssInfo.wgs === 1) result.inf_gs += 1;
        if (pssInfo.wc === 1 && pssInfo.cs >= 500) result.inf_wc += 1;
      }
    });
  }
  return result;
}
/**
 * 查询旅客相关信息
 * 值机、登机、拉下
 * @param lu
 * @returns {Array}
 */
export function queryPassenger(lu) {
  const result = { adu_cin: 0,
    adu_bn: 0,
    adu_leave: 0,
    chd_cin: 0,
    chd_bn: 0,
    chd_leave: 0,
    inf_cin: 0,
    inf_bn: 0,
    inf_leave: 0 };
  if (lu) {
    const sql = 'select * from dcs_pl where lu=? and wde=0';
    const passengerInfos = queryForList(sql, [lu]);
    passengerInfos.forEach((pssInfo) => {
      if (pssInfo.pty === 'adu') {
        if (pssInfo.wc === 1) result.adu_cin += 1;
        if (pssInfo.wb === 1 && pssInfo.wc === 1) result.adu_bn += 1;
        if (pssInfo.wlo === 1) result.adu_leave += 1;
      }
      if (pssInfo.pty === 'chd') {
        if (pssInfo.wc === 1) result.chd_cin += 1;
        if (pssInfo.wb === 1 && pssInfo.wc === 1) result.chd_bn += 1;
        if (pssInfo.wlo === 1) result.chd_leave += 1;
      }
      if (pssInfo.pty === 'inf') {
        if (pssInfo.wc === 1) result.inf_cin += 1;
        if (pssInfo.wb === 1 && pssInfo.wc === 1) result.inf_bn += 1;
        if (pssInfo.wlo === 1) result.inf_leave += 1;
      }
    });
    result.total_cin = result.adu_cin + result.chd_cin + result.inf_cin;
    result.total_bn = result.adu_bn + result.chd_bn + result.inf_bn;
    result.total_leave = result.adu_leave + result.chd_leave + result.inf_leave;
    return result;
  }
}
/**
 * 查询多航段舱单数据，旅客
 * @param lu 航段唯一标识
 */
export function queryCmxPassMsg(lu) {
  if (lu) {
    const sql = 'select pty, sa,count(1) amount,wml from dcs_pl  where lu =? and wc = 1 and wlo =0 group by pty,sa, wml';
    const passengerInfos = queryForList(sql, [lu]);
    const result = { oa_adu: 0,
      oa_chd: 0,
      oa_inf: 0,
      ob_adu: 0,
      ob_chd: 0,
      ob_inf: 0,
      oc_adu: 0,
      oc_chd: 0,
      oc_inf: 0,
      oa_adu2: 0,
      oa_chd2: 0,
      oa_inf2: 0,
      ob_adu2: 0,
      ob_chd2: 0,
      ob_inf2: 0,
      oc_adu2: 0,
      oc_chd2: 0,
      oc_inf2: 0 };
    passengerInfos.forEach((pinfo) => {
      if (pinfo) {
        if (pinfo.wml === 0) {
          if (pinfo.sa === 'oa') {
            if (pinfo.pty === 'adu') result.oa_adu = pinfo.amount;
            if (pinfo.pty === 'chd') result.oa_chd = pinfo.amount;
            if (pinfo.pty === 'inf') result.oa_inf = pinfo.amount;
          }
          if (pinfo.sa === 'ob') {
            if (pinfo.pty === 'adu') result.ob_adu = pinfo.amount;
            if (pinfo.pty === 'chd') result.ob_chd = pinfo.amount;
            if (pinfo.pty === 'inf') result.ob_inf = pinfo.amount;
          }
          if (pinfo.sa === 'oc') {
            if (pinfo.pty === 'adu') result.oc_adu = pinfo.amount;
            if (pinfo.pty === 'chd') result.oc_chd = pinfo.amount;
            if (pinfo.pty === 'inf') result.oc_inf = pinfo.amount;
          }
        } else {
          if (pinfo.sa === 'oa') {
            if (pinfo.pty === 'adu') result.oa_adu2 = pinfo.amount;
            if (pinfo.pty === 'chd') result.oa_chd2 = pinfo.amount;
            if (pinfo.pty === 'inf') result.oa_inf2 = pinfo.amount;
          }
          if (pinfo.sa === 'ob') {
            if (pinfo.pty === 'adu') result.ob_adu2 = pinfo.amount;
            if (pinfo.pty === 'chd') result.ob_chd2 = pinfo.amount;
            if (pinfo.pty === 'inf') result.ob_inf2 = pinfo.amount;
          }
          if (pinfo.sa === 'oc') {
            if (pinfo.pty === 'adu') result.oc_adu2 = pinfo.amount;
            if (pinfo.pty === 'chd') result.oc_chd2 = pinfo.amount;
            if (pinfo.pty === 'inf') result.oc_inf2 = pinfo.amount;
          }
        }
      }
    });
    return result;
  }
}
