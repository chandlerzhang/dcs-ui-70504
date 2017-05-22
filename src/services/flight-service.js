/**
 * 用户相关的操作接口
 */

import {request} from '../utils/RequestUtil';
import {queryForObject, queryForList} from '../utils/DbUtil'
import lodash from 'lodash';

/**
 * 用户登录查询航班信息请求（异步）
 * @param params {fn,fd}
 * @returns {*} Msg
 */
export async function queryFlightForLogin(params) {
  const paras = {...params};
  return await request('/flight/queryFlight', {
    method: 'get',
    data: paras,
  });
}


/**
 * 修改航班信息（异步）
 * @param flight 对象
 * @returns {*} Msg
 */
export async function updateFlight(flight) {
  return await request('/updateFlight', {
    method: 'post',
    data: flight,
  });
}

/**
 * 航班查询
 * @param params 参数组合如下(len为参数数量)：{flu,len}根据flu精确查询,{fn,len}根据航班号模糊查询,
 * {fn,fd,len}根据航班号和航班日期查询,{fn,fd,sd,len}根据航班号、航班日期、目的站三字码查询，
 * {mfn,len}根据主航班号查询航班，
 * @returns {Array}
 */
export async function queryFlight(params) {

  if (params.len == 1 && params.fn) {

    const k = `%${params.fn}%`;
    return await queryForList('select * from dcs_fl where wde=0 and fn like ?', [k]);
  } else if (params.len == 2 && params.fn && params.fd) {
    return await queryForList('select * from dcs_fl where wde=0 and fn=? and fd=?', [params.fn, params.fd]);
  } else if (params.len == 3 && params.fn && params.fd && params.sd) {
    return await queryForList('select * from dcs_fl where wde=0 and fn=? and fd=? and sd=?', [params.fn, params.fd, params.sd]);
  } else if (params.len == 1 && params.flu) {
    return await queryForList('select * from dcs_fl where wde=0 and uui=?', [params.flu]);
  } else if (params.len == 1 && params.mfn) {
    return await queryForList('select * from dcs_fl where wde=0 and mfn=?', [params.mfn]);
  }
}

/**
 * 航班统计信息
 * @param flightInfo 航班信息对象
 * @param type 统计类型：alt+d，alt+v，alt+f，alt+f12
 * @returns {Array}
 */
export async function flightInfoStatistics(flightInfo, type) {
  let tpl;
  switch (type) {
    case 'alt+d':
      tpl = doflightInfo(flightInfo);
      break;
    case 'alt+v':
      break;
    case 'alt+f':
      break;
    case 'alt+f12':
      break;
    default:
      break;
  }
  return tpl;
}

/**
 * 航班信息统计 指令alt+d
 * @param flightInfo
 * @param map
 */
async function doflightInfo(flightInfo) {
  if (flightInfo.lt == 'stopover' || flightInfo.lt == 'sameFlight') {//多航段统计
    let firstLu;
    let secondLu;
    if (flightInfo.llu) {//上一航段唯一标示
      firstLu = flightInfo.llu;
      secondLu = flightInfo.uui;
    } else if (flightInfo.nlu) {//下一航段唯一标示
      firstLu = flightInfo.uui;
      secondLu = flightInfo.nlu;
    }
    let passBagAB = await queryForList('select count(*) count,case when sum( bw) is null then 0 else sum( bw) end sum ' +
      'from dcs_fb where  wde=0 and lu=? and wb = 0', [firstLu]);
    let passBagBC = await queryForList('select count(*) count,case when sum( bw) is null then 0 else sum( bw) end sum ' +
      'from dcs_fb where  wde=0 and lu=? and wb = 0', [secondLu]);
    let busBagAB = await queryForList('select count(*) count,case when sum( bw) is null then 0 else sum( bw) end sum ' +
      'from dcs_fb where  wde=0 and lu=? and wb = 1', [firstLu]);
    let busBagBC = await queryForList('select count(*) count,case when sum( bw) is null then 0 else sum( bw) end sum ' +
      'from dcs_fb where  wde=0 and lu=? and wb = 1', [secondLu]);
    let manifestAB = await queryForList("select sum(case when pty='adu' and wgs=0 then 1 else 0 end) sm," +
      "sum(case when pty='chd' and wgs=0 then 1 else 0 end) sc,sum(case when pty='inf' and wgs=0 then 1 else 0 end) si," +
      "sum(case when pty='adu' and wgs=1 then 1 else 0 end) gm,sum(case when pty='chd' and wgs=1 then 1 else 0 end) gc," +
      "sum(case when pty='inf' and wgs=1 then 1 else 0 end) gi,sum(case when wc =1 and pty='adu'  then 1 else 0 end) cm," +
      "sum(case when wc =1 and pty='chd'  then 1 else 0 end) cc,sum(case when wc =1 and pty='inf'  then 1 else 0 end) ci," +
      "sum(case when wet =1 and pty='adu'  then 1 else 0 end) em,sum(case when wet =1 and pty='chd'  then 1 else 0 end) ec," +
      "sum(case when wet =1 and pty='inf'  then 1 else 0 end) ei from dcs_pl where wde=0 and lu=? ", [firstLu]);
    let manifestBC = await queryForList("select sum(case when pty='adu' and wgs=0 then 1 else 0 end) sm," +
      "sum(case when pty='chd' and wgs=0 then 1 else 0 end) sc,sum(case when pty='inf' and wgs=0 then 1 else 0 end) si," +
      "sum(case when pty='adu' and wgs=1 then 1 else 0 end) gm,sum(case when pty='chd' and wgs=1 then 1 else 0 end) gc," +
      "sum(case when pty='inf' and wgs=1 then 1 else 0 end) gi,sum(case when wc =1 and pty='adu'  then 1 else 0 end) cm," +
      "sum(case when wc =1 and pty='chd'  then 1 else 0 end) cc,sum(case when wc =1 and pty='inf'  then 1 else 0 end) ci," +
      "sum(case when wet =1 and pty='adu'  then 1 else 0 end) em,sum(case when wet =1 and pty='chd'  then 1 else 0 end) ec," +
      "sum(case when wet =1 and pty='inf'  then 1 else 0 end) ei from dcs_pl where wde=0 and lu=? ", [secondLu]);
    let passAB = await queryForList("select sum(case when pty='adu' and sa='oa' then 1 else 0 end) am," +
      "sum(case when pty='chd' and sa='oa'  then 1 else 0 end) ac,sum(case when pty='inf' and sa='oa' then 1 else 0 end) ai," +
      "sum(case when pty='adu' and sa='ob' then 1 else 0 end) bm,sum(case when pty='chd' and sa='ob' then 1 else 0 end) bc," +
      "sum(case when pty='inf' and sa='ob' then 1 else 0 end) bi,sum(case when sa='oc' and pty='adu'  then 1 else 0 end) cm," +
      "sum(case when sa='oc' and pty='chd'  then 1 else 0 end) cc,sum(case when sa='oc' and pty='inf'  then 1 else 0 end) ci " +
      "from dcs_pl  where wde=0 and lu=? ", [firstLu]);
    let passBC = await queryForList("select sum(case when pty='adu' and sa='oa' then 1 else 0 end) am," +
      "sum(case when pty='chd' and sa='oa'  then 1 else 0 end) ac,sum(case when pty='inf' and sa='oa' then 1 else 0 end) ai," +
      "sum(case when pty='adu' and sa='ob' then 1 else 0 end) bm,sum(case when pty='chd' and sa='ob' then 1 else 0 end) bc," +
      "sum(case when pty='inf' and sa='ob' then 1 else 0 end) bi,sum(case when sa='oc' and pty='adu'  then 1 else 0 end) cm," +
      "sum(case when sa='oc' and pty='chd'  then 1 else 0 end) cc,sum(case when sa='oc' and pty='inf'  then 1 else 0 end) ci " +
      "from dcs_pl  where wde=0 and lu=? ", [secondLu]);
    let crewAB = await queryForList("select  sum(case when sa='oa' and (ss='#' or (ss='x' and  svs ='j')) then 1 else 0 end) oa," +
      "sum(case when sa='ob' and (ss='#' or (ss='x' and  svs ='j')) then 1 else 0 end) ob," +
      "sum(case when sa='oc' and (ss='#' or (ss='x' and  svs ='j')) then 1 else 0 end) oc " +
      "from dcs_fs where wde = 0 and lu = ? ", [firstLu]);
    let crewBC = await queryForList("select  sum(case when sa='oa' and (ss='#' or (ss='x' and  svs ='j')) then 1 else 0 end) oa," +
      "sum(case when sa='ob' and (ss='#' or (ss='x' and  svs ='j')) then 1 else 0 end) ob," +
      "sum(case when sa='oc' and (ss='#' or (ss='x' and  svs ='j')) then 1 else 0 end) oc " +
      "from dcs_fs where wde = 0 and lu = ? ", [secondLu]);
    let flightAB = await queryForList("select  sum(case when wc =1 and pty='adu'  then 1 else 0 end) cm," +
      "sum(case when wc =1 and pty='chd'  then 1 else 0 end) cc,sum(case when wc =1 and pty='inf'  then 1 else 0 end) ci," +
      "sum(case when wb =1 and pty='adu'  then 1 else 0 end) bm,sum(case when wb =1 and pty='chd'  then 1 else 0 end) bc," +
      "sum(case when wb =1 and pty='inf'  then 1 else 0 end) bi,sum(case when wlo =1 and pty='adu'  then 1 else 0 end) wm," +
      "sum(case when wlo =1 and pty='chd'  then 1 else 0 end) wc,sum(case when wlo =1 and pty='inf'  then 1 else 0 end) wi " +
      "from dcs_pl where wde = 0 and lu = ? ", [firstLu]);
    let flightBC = await queryForList("select  sum(case when wc =1 and pty='adu'  then 1 else 0 end) cm," +
      "sum(case when wc =1 and pty='chd'  then 1 else 0 end) cc,sum(case when wc =1 and pty='inf'  then 1 else 0 end) ci," +
      "sum(case when wb =1 and pty='adu'  then 1 else 0 end) bm,sum(case when wb =1 and pty='chd'  then 1 else 0 end) bc," +
      "sum(case when wb =1 and pty='inf'  then 1 else 0 end) bi,sum(case when wlo =1 and pty='adu'  then 1 else 0 end) wm," +
      "sum(case when wlo =1 and pty='chd'  then 1 else 0 end) wc,sum(case when wlo =1 and pty='inf'  then 1 else 0 end) wi " +
      "from dcs_pl where wde = 0 and lu = ? ", [secondLu]);
    const tpl = `
    行李统计:
    A-B
    分类        件数    重量
    普通行李    ${lodash.padEnd(passBagAB[0].count, 8, ' ')}${lodash.padEnd(passBagAB[0].sum, 8, ' ')}
    商务行李    ${lodash.padEnd(busBagAB[0].count, 8, ' ')}${lodash.padEnd(busBagAB[0].sum / 1000, 8, ' ')}
    合计        ${lodash.padEnd((passBagAB[0].count + busBagAB[0].count), 8, ' ')}${lodash.padEnd((passBagAB[0].sum + busBagAB[0].sum) / 1000, 8, ' ')}
    B-C
    分类        件数    重量
    普通行李    ${lodash.padEnd(passBagBC[0].count, 8, ' ')}${lodash.padEnd(passBagBC[0].sum, 8, ' ')}
    商务行李    ${lodash.padEnd(busBagBC[0].count, 8, ' ')}${lodash.padEnd(busBagBC[0].sum / 1000, 8, ' ')}
    合计        ${lodash.padEnd((passBagBC[0].count + busBagBC[0].count), 8, ' ')}${lodash.padEnd((passBagBC[0].sum + busBagBC[0].sum) / 1000, 8, ' ')}
    
    旅客名单统计
    A-B
    分类        成人    儿童    婴儿
    销售合计    ${lodash.padEnd(manifestAB[0].sm, 8, ' ')}${lodash.padEnd(manifestAB[0].sc, 8, ' ')}${lodash.padEnd(manifestAB[0].si, 8, ' ')}
    候补合计    ${lodash.padEnd(manifestAB[0].gm, 8, ' ')}${lodash.padEnd(manifestAB[0].gc, 8, ' ')}${lodash.padEnd(manifestAB[0].gi, 8, ' ')}
    值机合计    ${lodash.padEnd(manifestAB[0].cm, 8, ' ')}${lodash.padEnd(manifestAB[0].cc, 8, ' ')}${lodash.padEnd(manifestAB[0].ci, 8, ' ')}
    电子客票    ${lodash.padEnd(manifestAB[0].em, 8, ' ')}${lodash.padEnd(manifestAB[0].ec, 8, ' ')}${lodash.padEnd(manifestAB[0].ei, 8, ' ')}
    B-C
    分类        成人    儿童    婴儿
    销售合计    ${lodash.padEnd(manifestBC[0].sm, 8, ' ')}${lodash.padEnd(manifestBC[0].sc, 8, ' ')}${lodash.padEnd(manifestBC[0].si, 8, ' ')}
    候补合计    ${lodash.padEnd(manifestBC[0].gm, 8, ' ')}${lodash.padEnd(manifestBC[0].gc, 8, ' ')}${lodash.padEnd(manifestBC[0].gi, 8, ' ')}
    值机合计    ${lodash.padEnd(manifestBC[0].cm, 8, ' ')}${lodash.padEnd(manifestBC[0].cc, 8, ' ')}${lodash.padEnd(manifestBC[0].ci, 8, ' ')}
    电子客票    ${lodash.padEnd(manifestBC[0].em, 8, ' ')}${lodash.padEnd(manifestBC[0].ec, 8, ' ')}${lodash.padEnd(manifestBC[0].ei, 8, ' ')}
    
    舱单统计
    A-B
    分类    成人    儿童    婴儿    机组
    OA区    ${lodash.padEnd(passAB[0].am, 8, ' ')}${lodash.padEnd(passAB[0].ac, 8, ' ')}${lodash.padEnd(passAB[0].ai, 8, ' ')}${lodash.padEnd(crewAB[0].oa, 8, ' ')}
    OB区    ${lodash.padEnd(passAB[0].bm, 8, ' ')}${lodash.padEnd(passAB[0].bc, 8, ' ')}${lodash.padEnd(passAB[0].bi, 8, ' ')}${lodash.padEnd(crewAB[0].ob, 8, ' ')}
    OC区    ${lodash.padEnd(passAB[0].cm, 8, ' ')}${lodash.padEnd(passAB[0].cc, 8, ' ')}${lodash.padEnd(passAB[0].ci, 8, ' ')}${lodash.padEnd(crewAB[0].oc, 8, ' ')}
    合计    ${lodash.padEnd((passAB[0].am + passAB[0].bm + passAB[0].cm), 8, ' ')}${lodash.padEnd((passAB[0].ac + passAB[0].bc + passAB[0].cc), 8, ' ')}${lodash.padEnd((passAB[0].ai + passAB[0].bi + passAB[0].ci), 8, ' ')}${lodash.padEnd((crewAB[0].oa + crewAB[0].ob + crewAB[0].oc), 8, ' ')} 
    B-C
    分类    成人    儿童    婴儿    机组
    OA区    ${lodash.padEnd(passBC[0].am, 8, ' ')}${lodash.padEnd(passBC[0].ac, 8, ' ')}${lodash.padEnd(passBC[0].ai, 8, ' ')}${lodash.padEnd(crewBC[0].oa, 8, ' ')}
    OB区    ${lodash.padEnd(passBC[0].bm, 8, ' ')}${lodash.padEnd(passBC[0].bc, 8, ' ')}${lodash.padEnd(passBC[0].bi, 8, ' ')}${lodash.padEnd(crewBC[0].ob, 8, ' ')}
    OC区    ${lodash.padEnd(passBC[0].cm, 8, ' ')}${lodash.padEnd(passBC[0].cc, 8, ' ')}${lodash.padEnd(passBC[0].ci, 8, ' ')}${lodash.padEnd(crewBC[0].oc, 8, ' ')}
    合计    ${lodash.padEnd((passBC[0].am + passBC[0].bm + passBC[0].cm), 8, ' ')}${lodash.padEnd((passBC[0].ac + passBC[0].bc + passBC[0].cc), 8, ' ')}${lodash.padEnd((passBC[0].ai + passBC[0].bi + passBC[0].ci), 8, ' ')}${lodash.padEnd((crewBC[0].oa + crewBC[0].ob + crewBC[0].oc), 8, ' ')} 
    
    航班统计
    A-B
    分类    值机    登机    拉下
    成人    ${lodash.padEnd(flightAB[0].cm, 8, ' ')}${lodash.padEnd(flightAB[0].bm, 8, ' ')}${lodash.padEnd(flightAB[0].wm, 8, ' ')}
    儿童    ${lodash.padEnd(flightAB[0].cc, 8, ' ')}${lodash.padEnd(flightAB[0].bc, 8, ' ')}${lodash.padEnd(flightAB[0].wc, 8, ' ')}
    婴儿    ${lodash.padEnd(flightAB[0].ci, 8, ' ')}${lodash.padEnd(flightAB[0].bi, 8, ' ')}${lodash.padEnd(flightAB[0].wi, 8, ' ')}
    合计    ${lodash.padEnd((flightAB[0].cm + flightAB[0].cc + flightAB[0].ci), 8, ' ')}${lodash.padEnd((flightAB[0].bm + flightAB[0].bc + flightAB[0].bi), 8, ' ')}${lodash.padEnd((flightAB[0].wm + flightAB[0].wc + flightAB[0].wi), 8, ' ')}
    B-C
    分类    值机    登机    拉下
    成人    ${lodash.padEnd(flightBC[0].cm, 8, ' ')}${lodash.padEnd(flightBC[0].bm, 8, ' ')}${lodash.padEnd(flightBC[0].wm, 8, ' ')}
    儿童    ${lodash.padEnd(flightBC[0].cc, 8, ' ')}${lodash.padEnd(flightBC[0].bc, 8, ' ')}${lodash.padEnd(flightBC[0].wc, 8, ' ')}
    婴儿    ${lodash.padEnd(flightBC[0].ci, 8, ' ')}${lodash.padEnd(flightBC[0].bi, 8, ' ')}${lodash.padEnd(flightBC[0].wi, 8, ' ')}
    合计    ${lodash.padEnd((flightBC[0].cm + flightBC[0].cc + flightBC[0].ci), 8, ' ')}${lodash.padEnd((flightBC[0].bm + flightBC[0].bc + flightBC[0].bi), 8, ' ')}${lodash.padEnd((flightBC[0].wm + flightBC[0].wc + flightBC[0].wi), 8, ' ')}
    `;
    return tpl;
  } else {//单航段统计
    let passBag = await queryForList('select count(*) count,case when sum( bw) is null then 0 else sum( bw) end sum from dcs_fb ' +
      'where  wde=0 and lu=? and wb = 0', [flightInfo.uui]);
    let busBag = await queryForList('select count(*) count,case when sum( bw) is null then 0 else sum( bw) end sum from dcs_fb ' +
      'where  wde=0 and lu=? and wb = 1', [flightInfo.uui]);
    let manifest = await queryForList("select sum(case when pty='adu' and wgs=0 then 1 else 0 end) sm," +
      "sum(case when pty='chd' and wgs=0 then 1 else 0 end) sc,sum(case when pty='inf' and wgs=0 then 1 else 0 end) si," +
      "sum(case when pty='adu' and wgs=1 then 1 else 0 end) gm,sum(case when pty='chd' and wgs=1 then 1 else 0 end) gc," +
      "sum(case when pty='inf' and wgs=1 then 1 else 0 end) gi,sum(case when wc =1 and pty='adu'  then 1 else 0 end) cm," +
      "sum(case when wc =1 and pty='chd'  then 1 else 0 end) cc,sum(case when wc =1 and pty='inf'  then 1 else 0 end) ci," +
      "sum(case when wet =1 and pty='adu'  then 1 else 0 end) em,sum(case when wet =1 and pty='chd'  then 1 else 0 end) ec," +
      "sum(case when wet =1 and pty='inf'  then 1 else 0 end) ei from dcs_pl where wde=0 and lu=?", [flightInfo.uui]);
    let pass = await queryForList("select sum(case when pty='adu' and sa='oa' then 1 else 0 end) am," +
      "sum(case when pty='chd' and sa='oa'  then 1 else 0 end) ac,sum(case when pty='inf' and sa='oa' then 1 else 0 end) ai," +
      "sum(case when pty='adu' and sa='ob' then 1 else 0 end) bm,sum(case when pty='chd' and sa='ob' then 1 else 0 end) bc," +
      "sum(case when pty='inf' and sa='ob' then 1 else 0 end) bi,sum(case when sa='oc' and pty='adu'  then 1 else 0 end) cm," +
      "sum(case when sa='oc' and pty='chd'  then 1 else 0 end) cc,sum(case when sa='oc' and pty='inf'  then 1 else 0 end) ci " +
      "from dcs_pl  where wde=0 and lu=? ", [flightInfo.uui]);
    let crew = await queryForList("select  sum(case when sa='oa' and (ss='#' or (ss='x' and  svs ='j')) then 1 else 0 end) oa," +
      "sum(case when sa='ob' and (ss='#' or (ss='x' and  svs ='j')) then 1 else 0 end) ob," +
      "sum(case when sa='oc' and (ss='#' or (ss='x' and  svs ='j')) then 1 else 0 end) oc " +
      "from dcs_fs where wde = 0 and lu = ? ", [flightInfo.uui]);
    let flight = await queryForList("select  sum(case when wc =1 and pty='adu'  then 1 else 0 end) cm," +
      "sum(case when wc =1 and pty='chd'  then 1 else 0 end) cc,sum(case when wc =1 and pty='inf'  then 1 else 0 end) ci," +
      "sum(case when wb =1 and pty='adu'  then 1 else 0 end) bm,sum(case when wb =1 and pty='chd'  then 1 else 0 end) bc," +
      "sum(case when wb =1 and pty='inf'  then 1 else 0 end) bi,sum(case when wlo =1 and pty='adu'  then 1 else 0 end) wm," +
      "sum(case when wlo =1 and pty='chd'  then 1 else 0 end) wc,sum(case when wlo =1 and pty='inf'  then 1 else 0 end) wi " +
      "from dcs_pl where wde = 0 and lu = ? ", [flightInfo.uui]);

    const tpl = `
    行李统计:
    分类        件数    重量
    普通行李    ${lodash.padEnd(passBag[0].count, 8, ' ')}${lodash.padEnd(passBag[0].sum, 8, ' ')}
    商务行李    ${lodash.padEnd(busBag[0].count, 8, ' ')}${lodash.padEnd(busBag[0].sum / 1000, 8, ' ')}
    合计        ${lodash.padEnd((passBag[0].count + busBag[0].count), 8, ' ')}${lodash.padEnd((passBag[0].sum + busBag[0].sum) / 1000, 8, ' ')}
    
    旅客名单统计
    分类        成人    儿童    婴儿
    销售合计    ${lodash.padEnd(manifest[0].sm, 8, ' ')}${lodash.padEnd(manifest[0].sc, 8, ' ')}${lodash.padEnd(manifest[0].si, 8, ' ')}
    候补合计    ${lodash.padEnd(manifest[0].gm, 8, ' ')}${lodash.padEnd(manifest[0].gc, 8, ' ')}${lodash.padEnd(manifest[0].gi, 8, ' ')}
    值机合计    ${lodash.padEnd(manifest[0].cm, 8, ' ')}${lodash.padEnd(manifest[0].cc, 8, ' ')}${lodash.padEnd(manifest[0].ci, 8, ' ')}
    电子客票    ${lodash.padEnd(manifest[0].em, 8, ' ')}${lodash.padEnd(manifest[0].ec, 8, ' ')}${lodash.padEnd(manifest[0].ei, 8, ' ')}
    
    舱单统计
    分类    成人    儿童    婴儿    机组
    OA区    ${lodash.padEnd(pass[0].am, 8, ' ')}${lodash.padEnd(pass[0].ac, 8, ' ')}${lodash.padEnd(pass[0].ai, 8, ' ')}${lodash.padEnd(crew[0].oa, 8, ' ')}
    OB区    ${lodash.padEnd(pass[0].bm, 8, ' ')}${lodash.padEnd(pass[0].bc, 8, ' ')}${lodash.padEnd(pass[0].bi, 8, ' ')}${lodash.padEnd(crew[0].ob, 8, ' ')}
    OC区    ${lodash.padEnd(pass[0].cm, 8, ' ')}${lodash.padEnd(pass[0].cc, 8, ' ')}${lodash.padEnd(pass[0].ci, 8, ' ')}${lodash.padEnd(crew[0].oc, 8, ' ')}
    合计    ${lodash.padEnd((pass[0].am + pass[0].bm + pass[0].cm), 8, ' ')}${lodash.padEnd((pass[0].ac + pass[0].bc + pass[0].cc), 8, ' ')}${lodash.padEnd((pass[0].ai + pass[0].bi + pass[0].ci), 8, ' ')}${lodash.padEnd((crew[0].oa + crew[0].ob + crew[0].oc), 8, ' ')} 
    
    航班统计
    分类    值机    登机    拉下
    成人    ${lodash.padEnd(flight[0].cm, 8, ' ')}${lodash.padEnd(flight[0].bm, 8, ' ')}${lodash.padEnd(flight[0].wm, 8, ' ')}
    儿童    ${lodash.padEnd(flight[0].cc, 8, ' ')}${lodash.padEnd(flight[0].bc, 8, ' ')}${lodash.padEnd(flight[0].wc, 8, ' ')}
    婴儿    ${lodash.padEnd(flight[0].ci, 8, ' ')}${lodash.padEnd(flight[0].bi, 8, ' ')}${lodash.padEnd(flight[0].wi, 8, ' ')}
    合计    ${lodash.padEnd((flight[0].cm + flight[0].cc + flight[0].ci), 8, ' ')}${lodash.padEnd((flight[0].bm + flight[0].bc + flight[0].bi), 8, ' ')}${lodash.padEnd((flight[0].wm + flight[0].wc + flight[0].wi), 8, ' ')}
    `;
    return tpl;
  }
}

function exportTxt(txt) {
  let data = encodeURIComponent(txt)
  let uri = 'data:text/plain;chartset=utf-8,' + data
  let document = window.document
  let down = document.createElement('a')
  document.create
  down.href = uri
  down.download = 'test.txt'
  document.body.appendChild(down)
  down.click();
  document.body.removeChild(down)
}
