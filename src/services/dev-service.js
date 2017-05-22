/**
 * 设备相关接口
 */

import { queryForList, queryForObject } from '../utils/DbUtil';
import Ctx from '../utils/Context';
import { request } from '../utils/RequestUtil';
/**
 * 查询当前柜台的所有设备（查询中心的设备信息）
 * @return {Promise} Msg
 */
export function query() {
  return request(`/device/${Ctx.counterId}`, {
    method: 'get',
  });
}


/**
 * 1，请求服务端，更新当前柜台的柜台号，并根据选择的设备启用设备
 * 2，如果服务端返回操作成功，则更新terminal中的配置文件中的device.list
 * @param counter {String} 柜台号
 * @param deviceIds {Array} 选择启用的设备Id
 * @return {Promise} Msg
 */
export async function updateCounter(counter, deviceIds) {
  const msg = await request('/device/modifyCounterName', {
    method: 'post',
    data: {
      newCounterName: counter,
      deviceIds: deviceIds ? deviceIds.join(',') : null,
    },
  });
  if (msg.success && msg.obj && msg.obj.devices && msg.obj.devices.length > 0) {
    const devices = msg.obj.devices;

    devices.forEach((device) => {
      Ctx.dev.updateDeviceConfig(device.name, device.deviceConfig);
    });
    Ctx.dev.registerDevices(devices.map(d => d.name).join(','));
  }

  return msg;
}

/**
 * 打印登机牌
 * @param pUuids {Array} 待打印旅客的uuid集合
 * @param fu {String} 所属航段uuid
 */
export function printBoardingPass(pUuids, fu) {
  const datas = queryBoardingPass(pUuids, fu);

  if (datas && datas.length > 0) {
    datas.forEach((data) => {
      printATB(data);
    });

    incBoardingPassTimes(pUuids);
  }
}

/**
 * 打印单个登机牌
 * @param data 登机牌数据
 */
function printATB(data) {
  const format = parseDataOrAssert(Ctx.dev.getFormat('atb'));

  const printData = exactData(format, data);

  Ctx.dev.send(printData);
}

/**
 * 将打印格式流与数据流整合
 * @param format {String} 格式流
 * @param data {Object} 数据流
 */
function exactData(format, data) {
  return format.replace(/<(\w+):>/gi, (s1, s2) => {
    return data[s2.toLocaleLowerCase()] || '';
  });
}

/**
 * 解析jx端返回的Msg数据，如果失败抛出异常，否则返回期望值
 * @param r
 * @return {*}
 */
function parseDataOrAssert(r) {
  if (!r) throw 'data is null';
  if (!r.isSuccess()) throw r.getMsg();

  return r.getMsg();
}

/**
 * 查询所有待打印的数据
 * @param uuis
 * @param fu
 */
function queryBoardingPass(uuis, fu) {
  const fl = queryForObject('select * from dcs_fl where uui=?', [fu]);
  if (!fl) throw `flight leg ${fu} not found`;

  const isTwice = fl.wm && fl.wnc && !fl.wnb;
  const datas = [];

  uuis.forEach((uui) => {
    const data = buildOneData(uui);

    if (data.pt && data.pt > Ctx.getCfg().atbMaxPrintTimes) {
      throw `超过登机牌最大打印次数 ${Ctx.getCfg().atbMaxPrintTimes}`;
    }
    datas.push(data);

    // 判断是否需要添加下一行段的旅客数据到打印流
    if (isTwice && data.wml && data.nlu) {
      const next = buildOneData(data.nlu);
      if (next) {
        datas.push(next);
      }
    }
  });
  return datas;
}

/**
 * 根据uui查询一个待打印的数据
 * @param uui
 */
function buildOneData(uui) {
  const sql = 'select t.*,t1.cic edacn,t1.cic citycn,t1.cie city,t4.cic citycn2,t4.cie city2,t.osr seat,t2.gat gate,t.sea sn,  ' +
    ' t.sa sng,t2.tb bdt,t.cs bn,t.dpn id,t.oet et,t3.fn fn2,t.bco code,t.otp rmb,t1.cie edaen,t2.fde,t.osm docs                  ' +
    'from dcs_pl t                                                                                                                ' +
    'left join dcs_a t1 on t.sd=t1.tc and t1.wde=0                                                                                ' +
    'left join dcs_fl t2 on t.lu=t2.uui and t2.wde=0                                                                              ' +
    'left join dcs_fl t3 on t2.nlu=t3.uui and t3.wde=0                                                                            ' +
    'left join dcs_a t4 on t3.sar=t4.tc and t4.wde=0                                                                              ' +
    'where t.uui=?';
  const d = queryForObject(sql, [uui]);

  if (!d) throw `build one data error ${uui}`;
  if (d.wet) { // 如果是电子客票
    d.tn = 'ETKT';
  }
  if (d.pty === 'inf') { // 如果是婴儿
    d.gender = 'INF';
  }
  if (!d.wml) { // 如果不是多航段旅客
    d.city2 = '';
    d.citycn2 = '';
  }
  if (d.fde) { // 航班日期显示英文格式，例如：03May
    d.fd = d.fde;
  }
  if (d.bdt && d.bdt.length > 4) { // 截取登机时间格式，例如112000 截取为1120
    d.bdt = d.bdt.substring(0, 4);
  }
  if (d.sng && d.sng.length >= 2) { // 舱位需要截取一位
    d.sng = d.sng.substring(1, 2);
  }
  if (d.bn && d.bn.length !== 3) { // 值机需要前补0到3位
    const bn = `000${d.bn}`;
    d.bn = bn.substring(bn.length - 3);
  }

  return d;
}

/**
 * 根据行李uui打印行李牌，如果已经获取到完整行李牌数据流请调用 printBTP 方法（效率更高）
 * @param uui 行李uui
 */
export async function printBag(uui) {
  const data = await queryBagData(uui);

  printBTP(data);
}

/**
 * 根据完整行李牌数据流 打印 行李牌，如：重打行李牌功能
 * @param data 行李牌数据流
 */
export function printBTP(data) {
  const format = Ctx.dev.getFormat('btp');

  const r = Ctx.dev.send('btp', exactData(format, data));
  if (r && r.isSuccess()) {
    incBagTimes([data.uui]);
  }
}

async function queryBagData(uui) {
  const sql = 'select t.uui,t1.cna cn,t1.opn ri ,1 baga,t.bw bagw,t.bn bagn,t1.ena en,t1.osr seat,\n' +
    't2.sar via_da,t2.co via_co,t2.fn via_fn,t2.fde via_fd,t3.cie via_cy,t3.cic via_cn,\n' +
    't4.sar final_da,t4.co final_co,t4.fn final_fn,t4.fde final_fd,t5.cie final_cy,t5.cic final_cn,\n' +
    't6.na prefix,case when t.sar=t.sd then 1 else 0 end wml,t1.cs bn\n' +
    'from dcs_fb t\n' +
    'left join dcs_pl t1 on t.plu=t1.uui\n' +
    'left join dcs_fl t2 on t.lu=t2.uui\n' +
    'left join dcs_a t3 on t3.tc=t2.sar\n' +
    'left join dcs_fl t4 on t2.nln=t4.uui\n' +
    'left join dcs_a t5 on t5.tc=t4.sar\n' +
    'left join dcs_dict t6 on t2.co=t6.tp where t.uui=? and t.wde=0';

  const data = await queryForObject(sql, [uui]);

  return dealBaggage(data, data.wml);
}

function dealBaggage(data, wml) {
  if (!data.final_da || !wml) { // 单航段
    data.final_da = data.via_da;
    data.final_co = data.via_co;
    data.final_fn = data.via_fn;
    data.final_fd = data.via_fd;
    data.final_cy = data.via_cy;
    data.final_cn = data.via_cn;

    data.via_da = '';
    data.via_co = '';
    data.via_fn = '';
    data.via_fd = '';
    data.via_cy = '';
    data.via_cn = '';

    data.final_co = data.final_co ? data.final_co : '9c';
  } else { // 多航段
    data.via_co = data.via_co ? data.via_co : '9c';
    data.final_co = data.final_co ? data.final_co : '9c';

    data.via_fn = data.via_fn.startsWith('9c') ? data.via_fn.substring(2) : data.via_fn;
    data.final_fn = data.final_fn.startsWith('9c') ? data.final_fn.substring(2) : data.final_fn;
  }

  return data;
}

/**
 * 查询重打行李牌界面数据
 * @param plu 旅客uui
 * @param fu 航段uui
 * @return {Promise.<Array>}
 */
export async function queryBagDatas(plu, fu) {
  const sql = 'select t.uui,t1.cna cn,t1.opn ri ,1 baga,t.bw bagw,t.bn bagn,t1.ena en,t1.osr seat,\n' +
    't2.sar via_da,t2.co via_co,t2.fn via_fn,t2.fde via_fd,t3.cie via_cy,t3.cic via_cn,\n' +
    't4.sar final_da,t4.co final_co,t4.fn final_fn,t4.fde final_fd,t5.cie final_cy,t5.cic final_cn,\n' +
    't6.na prefix,t2.wm wml,t1.cs bn\n' +
    'from dcs_fb t\n' +
    'left join dcs_pl t1 on t.plu=t1.uui\n' +
    'left join dcs_fl t2 on t.lu=t2.uui\n' +
    'left join dcs_a t3 on t3.tc=t2.sar\n' +
    'left join dcs_fl t4 on t2.nln=t4.uui\n' +
    'left join dcs_a t5 on t5.tc=t4.sar\n' +
    'left join dcs_dict t6 on t2.co=t6.tp where t1.uui=? and t2.uui=? and t.wde=0';

  const datas = await queryForList(sql, [plu, fu]),
    newDatas = [];

  let index = 0,
    cn,
    weight = 0,
    finalDa;
  datas.forEach((data) => {
    index++;
    cn = data.cn;
    weight += data.bagw;

    const newData = dealBaggage(data, data.wml);
    finalDa = newData.final_da;
    newDatas.push(newData);
  });

  return {
    cn,
    final_da: finalDa,
    index,
    weight: weight.toFixed(2),
    list: newDatas,
  };
}

/**
 * 查询重打商务行李牌的数据
 * @param fu 航段uui
 * @return {Object}
 */
export async function queryReprintBizBag(fu) {
  const sql = 'select t.uui,1 baga,t.bw bagw,t.bn bagn,\n' +
    't2.sar via_da,t2.co via_co,t2.fn via_fn,t2.fde via_fd,t3.cie via_cy,t3.cic via_cn,\n' +
    't4.sar final_da,t4.co final_co,t4.fn final_fn,t4.fde final_fd,t5.cie final_cy,t5.cic final_cn,\n' +
    't6.na prefix,case when t.sar=t.sd then 1 else 0 end wml\n' +
    'from dcs_fb t\n' +
    'left join dcs_fl t2 on t.lu=t2.uui\n' +
    'left join dcs_a t3 on t3.tc=t2.sar\n' +
    'left join dcs_fl t4 on t2.nln=t4.uui\n' +
    'left join dcs_a t5 on t5.tc=t4.sar\n' +
    'left join dcs_dict t6 on t2.co=t6.tp where t.lu=? and t.wde=0 and t.wb=1';

  const datas = await queryForList(sql, [fu]),
    newDatas = [];

  let index = 0,
    weight = 0,
    finalDa;

  datas.forEach((data) => {
    index++;
    weight += data.bagw;

    const newData = dealBaggage(data, data.wml);
    finalDa = newData.final_da;

    newDatas.push(newData);
  });

  return {
    final_da: finalDa,
    index,
    weight: weight.toFixed(2),
    list: newDatas,
  };
}

/**
 * 将行李牌的打印次数+1（异步）
 * @param uuids {Array} 行李uuid数组
 */
async function incBagTimes(uuids) {
  return request('/device/incrBTP', {
    method: 'post',
    data: {
      ids: uuids.join(','),
    },
  });
}

/**
 * 将登机牌的打印次数+1（异步）
 * @param uuids {Array} 旅客uuid数组
 */
async function incBoardingPassTimes(uuids) {
  return request('/device/incrATB', {
    method: 'post',
    data: {
      ids: uuids.join(','),
    },
  });
}
