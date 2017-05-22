/**
 * 旅客服务操作接口
 */
import { request } from '../utils/RequestUtil';
import { queryForList, queryForObject } from '../utils/DbUtil';

/**
 * 旅客服务查询
 * @param uui 旅客航段唯一标识
 */
export async function passQueryServer(uui) {
  // 查询所有可选旅客服务，界面可以显示，且没有被删除的
  const dicts = await queryForList('select * from dcs_ssr where ws = 1 and wde = 0');
  // 已排除选择的服务
  const showDicts = [];
  // 旅客已选择的服务
  const passengerServer = {};
  const selectedSvr = [];
  const passengerinfo = await queryForObject('select * from dcs_pl where uui=? ', [uui]);
  if (passengerinfo) {
    let m = 0;
    let t = 0;
    let flag = true;
    const pstinfo = passengerinfo.pst;
    dicts.forEach((dict) => {
      if (pstinfo) {
        const plpst = pstinfo.split(',');
        for (let i = 0; i < plpst.length; i += 1) {
          if (dict.na === plpst[i]) {
            passengerServer.na = dict.na;  // 服务类型
            passengerServer.en = dict.en;  // 英文说明
            passengerServer.cn = dict.cn;  // 中文说明
            passengerServer.wp = dict.wp;  // 是否优先登机
            selectedSvr[t] = passengerServer;
            t += 1;
            flag = false;
            break;
          }
        }
      }
      if (flag) {
        showDicts[m] = dict;
        m += 1;
      }
    });
  }
  return {
    showDicts, selectedSvr, cn: passengerinfo.cna,
  };
}
/**
 *  修改旅客服务
 * @param uui
 * @param passengerServer
 * @returns {Promise.<*>}
 */
export async function updatePassengerServer(uui, passengerServer) {
  return await request('/passengerServer/updatePassengerServer', {
    method: 'post',
    data: {
      uui,
      passengerServer,
    },
  });
}
