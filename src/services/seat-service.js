/**
 * 航班座位操作接口
 * Created by 011414 on 2017/5/15.
 */
import { request } from '../utils/RequestUtil';
import { queryForList, queryForObject } from '../utils/DbUtil';

/**
 * 航段座位查询
 * @param lu  航段唯一标识
 */
export function querySeatInfo(lu) {
  if (lu) {
    const result = {};
    let seatinfo = {};
    const zinfo = {};
    const arrays = getfluui(lu);
    if (arrays.length > 0) {
      arrays.forEach((info, i) => {
        seatinfo = queryForList('select * from dcs_fs where lu = ? and wde=0', [info.uui]);
        zinfo.sde = info.sde;
        zinfo.sar = info.sar;
        // 获取座位详细信息
        seatinfo.forEach((seat) => {
          zinfo[seat.sse] = { svs: seat.svs, ss: seat.ss };
        });
        result[i] = zinfo;
      });
    }
    return result;
  }
}
/**
 * 航班座位维护
 * @param lu
 * @param st
 * @param startRn
 * @param endRn
 * @param cns
 */
export async function operateFlightSeat(params) {
  return await request('/seat/operateFlightSeat', {
    method: 'post',
    data: params,
  });
}
/**
 * 获取旅客航程信息
 * @param lu
 * @returns {Array}
 */
function getfluui(lu) {
  const arrays = [];
  let fls = queryForObject('select uui,sde,sar from dcs_fl where uui=?', [lu]);
  if (fls.length > 0) {
    arrays[0] = { uui: fls.uui, sde: fls.sde, sar: fls.sar };
    while (fls.nlu && fls.nlu > 0) {
      fls = queryForList('select  sde, sar, nlu from dcs_fl where uui=?', [fls.nlu]);
      arrays[arrays.length] = { uui: fls.uui, sde: fls.sde, sar: fls.sar };
    }
  }
  return arrays;
}
