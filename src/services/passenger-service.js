/* eslint-disable no-unused-vars,no-param-reassign */
/**
 * 旅客查询接口
 */
import $ from 'jquery';
import { queryForList, queryForObject } from '../utils/DbUtil';

/**
 * 查询旅客列表
 * @param cmd 根据指定的关键字查询旅客列表信息
 * @param lu 航段唯一标识
 * @param sar 到达站三字码
 * @param lmb 最后一次修改人
 * @return []
 */
export function queryPassenger(cmd, lu, sar, lmb) {
  let passengerView = '';
  const MAXROWNUM = 500;
  let c = cmd;
  if (c && lu) {
    c = c.replace(/\s+/g, '');// 忽略所有空格
    c = c.replace(/；/g, ';');// 标点中英文转换
    c = c.replace(/，/g, ',');// 标点中英文转换
    // 显示某仓位的旅客
    const saSdSql = 'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join dcs_fb fb on pl.uui = fb.plu ' +
      'where pl.sd = ? and pl.wde = 0 and pl.sa = ? and pl.lu = ? ' +
      'order by pl.ena limit 0,?';
    const saNosdSql = 'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where pl.wde = 0 and pl.sa = ? and pl.lu = ? ' +
      'order by pl.ena limit 0,?';
    if (c.startsWith('/oa')) { // oa：显示oa仓位的旅客
      if (c.length > 3) {
        passengerView = queryForList(saSdSql, [c.substring(3), 'oa', lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(saNosdSql, ['oa', lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/ob')) {
      if (c.length > 3) {
        passengerView = queryForList(saSdSql, [c.substring(3), 'ob', lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(saNosdSql, ['ob', lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/oc')) {
      if (c.length > 3) {
        passengerView = queryForList(saSdSql, [c.substring(3), 'oc', lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(saNosdSql, ['oc', lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/bagn')) { // 根据行李号提取旅客
      let orns = [];
      if (c.length > 5) {
        const bsn = c.substring(5);
        orns = bsn.split(',');
      }
      let params = new Array(orns.length + 2);
      if (orns.length > 0) {
        let sqlBuild = 'select distinct pl.*, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
          't2.cna rin ,pb.bn ' +
          'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn join dcs_fb pb on pb.plu = pl.uui ' +
          'where pb.bn in ( ';
        const data = setSql(orns, params, sqlBuild);
        params = data.params;
        sqlBuild = data.sqlBuild;
        sqlBuild += ' ) and  pl.wde =0 and  pl.lu = ?  order by pl.ena  limit 0,?';
        params[orns.length] = lu;
        params[orns.length + 1] = MAXROWNUM;
        passengerView = queryForList(sqlBuild, params);
      } else { // 不输入行李号则查询所有有行李的旅客
        const sql = 'select distinct pl.*, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
          't2.cna rin , pb.bn ' +
          'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn join dcs_fb pb on pb.plu = pl.uui ' +
          'where pl.bc > 0 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?';
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/ctn')) { // ctn：根据同行值机序号查询旅客
      const ctn = c.substring(4);
      const sql = 'select distinct pl.*, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
        't2.cna rin, fb.bn ' +
        'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
        ' left join  dcs_fb fb on pl.uui = fb.plu ' +
        'where pl.wde = 0 and pl.lu = ? and pl.wfe = 1 and pl.pfs = ? order by pl.ena limit 0,?';
      passengerView = queryForList(sql, [lu, ctn, MAXROWNUM]);
    } else if (c.startsWith('/ct')) { // ct：查询座位冲突的旅客
      let s = '';
      if (c.length > 3) {
        s = 'pl.sd = ? and ';
      }
      const fsql = 'select * from dcs_fs where wc = 1 and lu = ?';
      const flightSeats = queryForList(fsql, [lu]);
      if (flightSeats && flightSeats.length > 0) {
        const params = new Array((flightSeats.length * 2) + 2);
        let stringBuild = `${'select distinct pl.*, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
          't2.cna rin ,fb.bn ' +
          'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
        ' left join  dcs_fb fb on pl.uui = fb.plu ' +
          'where '}${s}pl.sea in (`;
        flightSeats.forEach((fs, i) => {
          if (i > 0) {
            stringBuild += ',';
          }
          params[i] = fs.rn + fs.cn;
          params[flightSeats.length + i] = `$${fs.rn}${fs.cn}`;
          stringBuild += ' ? ,? ';
        });
        stringBuild += ') and  pl.wde =0 and pl.lu = ? order by pl.ena limit 0,? ';
        params[flightSeats.length * 2] = lu;
        params[(flightSeats.length * 2) + 1] = MAXROWNUM;
        if (s.length > 1) {
          const param = params.slice(0);
          param.unshift(c.substring(3));
          passengerView = queryForList(stringBuild, param);
        } else {
          passengerView = queryForList(stringBuild, params);
        }
      } else {
        passengerView = queryForList('select * from dcs_pl where 1 < 0');
      }
    } else if (c.startsWith('/idcard')) { // idcard：证件号提取旅客
      const cardId = c.substring(8);
      const cardIds = cardId.split(',');
      let params = [];
      if (cardIds.length > 1) {
        let sqlBuild = 'select distinct pl.*, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
          't2.cna rin, fb.bn ' +
          'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
          ' left join  dcs_fb fb on pl.uui = fb.plu ' +
          'where pl.dn in(';
        const datas = setSql(cardIds, params, sqlBuild);
        params = datas.params;
        sqlBuild = datas.sqlBuild;
        sqlBuild += ') and pl.sar = ? and  pl.wde =0 and pl.lu = ? order by pl.ena  limit 0,?';
        params[cardIds.length] = sar;
        params[cardIds.length + 1] = lu;
        params[cardIds.length + 2] = MAXROWNUM;
        passengerView = queryForList(sqlBuild, params);
      } else {
        const stringBuild = 'select distinct pl.*, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
          't2.cna rin ,fb.bn ' +
          'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn' +
          ' left join  dcs_fb fb on pl.uui = fb.plu ' +
          ' where pl.dn = ? and pl.sar = ? and pl.wde =0 and pl.lu = ? ' +
          'order by pl.ena limit 0,? ';
        passengerView = queryForList(stringBuild, [cardId, lu, sar, MAXROWNUM]);
      }
    } else if (c.startsWith('/del')) { // del：查询已经办理退票手续的旅客名单
      let s = '';
      if (c.length > 4) {
        s = 'pl.sd = ? and ';
      }
      const stringBuild = `${'select distinct pl.*, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
        't2.cna rin  ,fb.bn ' +
        'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
        'where '}${s}pl.oat ='del'and  pl.wde =0 and pl.lu = ?  order by pl.ena  limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(stringBuild, [c.substring(4), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(stringBuild, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/v')) { // v 直通车收费旅客
      let s = '';
      if (c.length > 2) {
        s = 'pl.sd = ? and ';
      }
      const stringBuild = `${'select distinct pl.*, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
        't2.cna rin ,fb.bn ' +
        'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
        'where ztcf >0 and '}${s} pl.wde =0 and pl.lu = ?  order by pl.ena  limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(stringBuild, [c.substring(2), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(stringBuild, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/u')) { // u 逾重行李收费旅客
      let s = '';
      if (c.length > 2) {
        s = 'pl.sd = ? and ';
      }
      const stringBuild = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where yzsf >0 and '}${s} pl.wde =0 and pl.lu = ?  order by pl.ena  limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(stringBuild, [c.substring(2), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(stringBuild, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/a') && !c.startsWith('/ac') && !c.startsWith('/al') && !c.startsWith('/adult')) { // a 快登机收费旅客
      let s = '';
      if (c.length > 2) {
        s = 'pl.sd = ? and ';
      }
      const stringBuild = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where kdjf >0 and '}${s} pl.wde =0 and pl.lu = ? order by pl.ena  limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(stringBuild, [c.substring(2), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(stringBuild, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/r/')) { // /r/：查询预定过座位的乘客信息
      const sea = `$${c.substring(3)}`;
      const sql = 'select distinct pl.*, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
        't2.cna rin ,fb.bn  ' +
        'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
        ' left join  dcs_fb fb on pl.uui = fb.plu ' +
        'where pl.sea = ? and pl.wde =0 and pl.lu = ? ' +
        'order by pl.ena limit 0,? ';
      passengerView = queryForList(sql, [sea, lu, MAXROWNUM]);
    } else if (c.startsWith('/rose')) { // rose：查询购买商务经济座服务的旅客
      let s = '';
      // const rosepa = 'rose';
      if (c.length > 5) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.pst= 'rose' and  pl.wde =0 and pl.lu = ? order by pl.ena  limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(5), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/r')) { // r：查询所有预定过座位的乘客信息
      let s = '';
      if (c.length > 2) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.sea like '$%' and  pl.wde =0 and pl.lu = ? order by pl.ena  limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(2), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/na')) { // na：查询所有未值机旅客
      let s = '';
      if (c.length > 3) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.wc=0 and  pl.wde = 0 and pl.lu = ? order by pl.ena  limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(3), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/al')) { // al：查询所有旅客
      let s = '';
      if (c.length > 3) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.wde =0 and pl.lu = ? order by pl.ena  limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(3), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/ac')) { // ac：显示所有已值机的旅客
      let s = '';
      if (c.length > 3) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.wc=1 and  pl.wde =0 and pl.lu = ? order by pl.ena  limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(3), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/bna')) { // bna：显示所有未登机的旅客 wb =0
      let s = '';
      if (c.length > 4) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.wb=0 and  pl.wde =0 and pl.lu = ? order by pl.ena  limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(4), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/adult')) { // adult：显示所有成人旅客sex='成人'
      let s = '';
      if (c.length > 6) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.pty= 'adu' and pl.wde =0 and pl.lu = ? order by pl.ena  limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(6), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/bac')) { // bac：显示所有已登机的旅客 wb =1
      let s = '';
      if (c.length > 4) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(2), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/chd')) { // chd：显示所有儿童 sex='儿童'
      let s = '';
      if (c.length > 4) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.pty= 'chd' and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(4), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/et')) { // et：显示所有电子客票旅客
      let s = '';
      if (c.length > 3) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.wet =1 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(3), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/gsna')) { // gsna：显示所有未值机的候补旅客 wgs =1 and wci = 0
      let s = '';
      if (c.length > 5) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.wgs =1 and pl.wc =0 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(5), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/gsac')) { // gsac：显示所有已值机的候补旅客
      let s = '';
      if (c.length > 5) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.wgs =1 and pl.wc =1 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(5), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/gs')) { // gs：显示所有候补的旅客
      let s = '';
      if (c.length > 3) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.wgs =1 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(3), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/inf')) { // inf：显示所有未值机婴儿
      let s = '';
      if (c.length > 4) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.pty= 'inf ' and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(4), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/lset')) { // lset：显示此工号办理的电子客票旅客
      let s = '';
      if (c.length > 5) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.lmb =? and pl.wet =1 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(5), lmb, lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lmb, lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/lsnet')) { // lsnet：显示此工号办理的非电子客票旅客
      let s = '';
      if (c.length > 6) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.lmb =? and pl.wet =0 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(6), lmb, lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lmb, lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/ls')) { // lsnet：显示此工号办理的非电子客票旅客
      let s = '';
      if (c.length > 3) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.lmb =? and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(3), lmb, lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lmb, lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/wbna')) { // lsnet：显示此工号办理的非电子客票旅客
      let s = '';
      if (c.length > 5) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.wb =0 and pl.cs >500 and pl.wc=1 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(5), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/wbac')) { // wbac：显示所有已登机的办理网上值机的旅客
      let s = '';
      if (c.length > 5) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.wb =1 and pl.cs >500 and pl.wc=1 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(5), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/psaf')) { // psaf：显示安全座位旅客
      let s = '';
      if (c.length > 5) {
        s = 'pl.sd = ? and ';
      }
      const fssql = 'and pl.sea in(select concat( fs.rn , fs.cn) sea from dcs_fs  fs where fs.ws = 1  and fs.lu =  ?) ';
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where '}${s} pl.wde =0 and pl.lu = ? ${fssql} order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(5), lu, lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/line') && c.length() > 1) { // line 排号：根据座位排号提取旅客,多个排号用“,”隔开
      const result = null;
      const sea = c.substring(5);
      const seas = sea.split(',');
      const seats = new Array(seas.length * 6);
      const params = new Array((seas.length * 6) + 2);
      getSeatsByLine(seas, seats, params);

      const sql = 'select distinct pl.*, ' +
                  '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
                  '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
                  '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
                  't2.cna rin ,fb.bn  ' +
                  'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
                  ' left join  dcs_fb fb on pl.uui = fb.plu ' +
                  'where pl.wes=1 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,? ';
      let lists = queryForList(sql, [lu, MAXROWNUM]);
      if (lists && lists.length > 0) {
        addSeatPassenger(lists, result, seats);
      }
      if (seas.length > 0) {
        let sqlBuild = 'select distinct pl.*, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
          't2.cna rin ,fb.bn  ' +
          'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
          ' left join  dcs_fb fb on pl.uui = fb.plu ' +
          'where pl.sea in (';
        seas.forEach((seat) => {
          if (seas && seas.length > 0) {
            sqlBuild += ',';
          }
          sqlBuild += '?';
        });
        sqlBuild += ' ) and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,? ';
        params[seas.length * 6] = lu.toString();
        params[(seas.length * 6) + 1] = MAXROWNUM;
        lists = queryForList(sqlBuild, params);
      }
      if (lists && lists.length > 0) {
        addToResult(lists, result);
      }
      if (result.length() > 0) {
        passengersPaiXu(result);
      }
      passengerView = result;
    } else if (c.startsWith(';') && c.length > 1) { // ；座位号：根据座位号提取旅客,多个座位号用“,”隔开
      const result = null;
      const sea = c.substring(1);
      const seas = sea.split(',');
      let params = new Array((seas.length * 6) + 2);

      let sql = 'select distinct pl.*, ' +
                  '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
                  '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
                  '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
                  't2.cna rin ,fb.bn  ' +
                  'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
                  ' left join  dcs_fb fb on pl.uui = fb.plu ' +
                  'where pl.wes=1 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,? ';
      let lists = queryForList(sql, [lu, MAXROWNUM]);
      if (lists && lists.length > 0) {
        addSeatPassenger(lists, result, seas);
      }
      if (seas.length > 0) {
        let sqlBuild = 'select distinct pl.*, ' +
                      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
                      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
                      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
                      't2.cna rin ,fb.bn  ' +
                      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn' +
                      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
                      ' where pl.sea in (';
        const data = setSql(seas, params, sqlBuild);
        params = data.params;
        sqlBuild = data.sqlBuild;
        sqlBuild += ' ) and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,? ';
        params[seas.length] = lu;
        params[seas.length + 1] = MAXROWNUM;
        lists = queryForList(sqlBuild, params);
      } else {
        sql = 'select distinct pl.*, ' +
              '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
              '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
              '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
              't2.cna rin ,fb.bn  ' +
              'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
             ' left join  dcs_fb fb on pl.uui = fb.plu ' +
              'where pl.sea = ? and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?';
        lists = queryForList(sql, [sea, lu, MAXROWNUM]);
      }
      if (lists && lists.length > 0) {
        addToResult(lists, result);
      }
      if (result.length() > 0) {
        passengersPaiXu(result);
      }
      passengerView = result;
    } else if (c.startsWith('.')) { // . 接收号：根据接收号提取旅客cs:值机序号
      const cin = c.substring(1);
      const cins = cin.split(',');
      let params = new Array(cins.length + 2);
      if (cins.length > 1) {
        let sqlBuild = 'select distinct pl.*, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
          't2.cna rin ,fb.bn  ' +
          'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
          ' left join  dcs_fb fb on pl.uui = fb.plu ' +
          'where pl.wc = 1 and pl.cs in (';
        const data = setSql(cins, params, sqlBuild);
        params = data.params;
        sqlBuild = data.sqlBuild;
        sqlBuild += ' ) and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,? ';
        params[cins.length] = lu;
        params[cins.length + 1] = MAXROWNUM;
        passengerView = queryForList(sqlBuild, params);
      } else {
        const sql = 'select distinct pl.*, ' +
                    '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
                    '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
                    '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
                    't2.cna rin ,fb.bn  ' +
                    'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
                    ' left join  dcs_fb fb on pl.uui = fb.plu ' +
                    'where pl.wc = 1 and pl.cs = ? and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?';
        passengerView = queryForList(sql, [cin, lu, MAXROWNUM]);
      }
    } else if (c.startsWith('*')) { // ＊ 订单号：根据订单号提取旅客
      const orn = c.substring(1);
      const orns = orn.split(',');
      let params = new Array(orns.length + 2);
      if (orns.length > 1) {
        let sqlBuild = 'select distinct pl.*, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
          't2.cna rin ,fb.bn  ' +
          'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
          ' left join  dcs_fb fb on pl.uui = fb.plu ' +
          'where pl.orn in (';
        const data = setSql(orns, params, sqlBuild);
        params = data.params;
        sqlBuild = data.sqlBuild;
        sqlBuild += ' ) and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,? ';
        params[orns.length] = lu;
        params[orns.length + 1] = MAXROWNUM;
        passengerView = queryForList(sqlBuild, params);
      } else {
        const sql = 'select distinct pl.*, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
          't2.cna rin ,fb.bn  ' +
          'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
          ' left join  dcs_fb fb on pl.uui = fb.plu ' +
          'where pl.orn = ? and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?';
        passengerView = queryForList(sql, [orn, lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/byname')) { // =：姓名模糊查询
      let name = c.substring(8).toLowerCase();
      const names = name.split(',');
      let params = new Array(names.length + 2);
      if (names.length <= 1) {
        name = `${name}%`;
        const sql = 'select distinct pl.*, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
          't2.cna rin ,fb.bn  ' +
          'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
          ' left join  dcs_fb fb on pl.uui = fb.plu ' +
          'where pl.ena like ? and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?';
        passengerView = queryForList(sql, [name, lu, MAXROWNUM]);
      } else {
        let sqlBuild = 'select distinct pl.*, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
          't2.cna rin ,fb.bn  ' +
          'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
          ' left join  dcs_fb fb on pl.uui = fb.plu ' +
          'where pl.ena in (';
        const data = sqlByName(names, params, sqlBuild);
        params = data.params;
        sqlBuild = data.sqlBuild;
        sqlBuild += ' ) and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,? ';
        params[names.length] = lu;
        params[names.length + 1] = MAXROWNUM;
        passengerView = queryForList(sqlBuild, params);
      }
    } else if (c.startsWith('/bag/eda')) { // /bag/eda:查询所有带行李的乘客信息
      let s = '';
      if (c.length > 8) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
        '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
        't2.cna rin ,fb.bn  ' +
        'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn join dcs_fb pb on pb.plu = pl.uui ' +
        'where'}${s} pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(8), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/bag')) { // bag：显示所有有行李的旅客 bc > 0
      if (c.length > 4) {
        const sql = 'select distinct pl.*, ' +
                      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
                      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
                      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
                      't2.cna rin ,fb.bn  ' +
                      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
                      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
                      'where pl.sd = ? and pl.bc > 0 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?';
        passengerView = queryForList(sql, [c.substring(4), lu, MAXROWNUM]);
      } else {
        const sql = 'select distinct pl.*, ' +
                    '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
                    '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
                    '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
                    't2.cna rin ,fb.bn  ' +
                    'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
                    ' left join  dcs_fb fb on pl.uui = fb.plu ' +
                    'where pl.bc > 0 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?';
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/dbn/')) { // /dbn/行李号 根据行李号查询删除行李的旅客 bsn=> bn
      const bsn = c.substring(5);
      const bsns = bsn.split(',');
      let params = new Array(bsns.length + 2);

      let sqlBuild = 'select distinct pl.*, ' +
                      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
                      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
                      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
                      't2.cna rin ,fb.bn  ' +
                      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn join dcs_fb pb on pb.plu = pl.uui ' +
                      'where pb.bn in ( ';
      const data = setSql(bsns, params, sqlBuild);
      params = data.params;
      sqlBuild = data.sqlBuild;
      sqlBuild += 'and pb.wde=1 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?';
      params[bsns.length] = lu;
      params[bsns.length + 1] = MAXROWNUM;
      passengerView = queryForList(sqlBuild, params);
    } else if (c.startsWith('/dbn')) { // /dbn:查询所有删除行李的乘客信息
      let s = '';
      if (c.length > 4) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn join dcs_fb pb on pb.plu = pl.uui ' +
      'where'}${s} pb.wde=1 and pl.wde =0 and pl.lu = ? order by pl.ena limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(4), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/spl/a')) { // /spl/a:提取订票旅客名单,按照订票时间升序排序
      let s = '';
      if (c.length > 6) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
                  '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
                  '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
                  '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
                  't2.cna rin ,fb.bn  ' +
                  'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
                  ' left join  dcs_fb fb on pl.uui = fb.plu ' +
                  'where'}${s} pl.wet=1 and pl.wde =0 and pl.lu = ? order by pl.od limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(6), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/spl/d')) { // /spl/d:提取订票旅客名单,按照订票时间降序排序
      let s = '';
      if (c.length > 6) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where'}${s} pl.wet=1 and pl.wde =0 and pl.lu = ? order by pl.od desc limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(6), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/cpl/a')) { // /cpl/a:提取值机旅客名单,按照值机时间升序排序 tc:值机时间
      let s = '';
      if (c.length > 6) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where'}${s} pl.wc=1 and pl.wde =0 and pl.lu = ? order by pl.tc limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(6), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/cpl/d')) { // /cpl/d:提取值机旅客名单,按照值机时间降序排序
      let s = '';
      if (c.length > 6) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where'}${s} pl.wc=1 and pl.wde =0 and pl.lu = ? order by pl.tc desc limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(6), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/bpl/a')) { // /bpl/a:提取登机旅客名单,按照登机时间升序排序 tb:登机时间
      let s = '';
      if (c.length > 6) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where'}${s} pl.wb=1 and pl.wde =0 and pl.lu = ? order by pl.tb limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(6), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.startsWith('/bpl/d')) { // /bpl/d:提取登机旅客名单,按照登机时间升序排序 tb:登机时间
      let s = '';
      if (c.length > 6) {
        s = 'pl.sd = ? and ';
      }
      const sql = `${'select distinct pl.*, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =3) ztcf, ' +
      '(select sum(cha) from dcs_fee t1 where pl.uui = t1.plu and wde =0 and cty =4) kdjf, ' +
      't2.cna rin ,fb.bn  ' +
      'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn ' +
      ' left join  dcs_fb fb on pl.uui = fb.plu ' +
      'where'}${s} pl.wb=1 and pl.wde =0 and pl.lu = ? order by pl.tb desc limit 0,?`;
      if (s.length > 1) {
        passengerView = queryForList(sql, [c.substring(6), lu, MAXROWNUM]);
      } else {
        passengerView = queryForList(sql, [lu, MAXROWNUM]);
      }
    } else if (c.toLowerCase() === '/topic') {
      passengerView = queryTopic(lu.toString());
    }
    return setPassenger(passengerView, lu);
  }
}
/**
 * 给旅客显示信息进行绑定
 *
 * @param ps  旅客列表
 * @param lu  航段唯一标识
 * @return List<PassengerView>
 */
function setPassenger(ps, lu) {
  // 标记座位冲突旅客
  const sql = 'select * from dcs_fs  where wc = 1 and lu = ?';
  const flightSeats = queryForList(sql, [lu]);
  const seatArrays = [];
  if (flightSeats && flightSeats.length > 0) {
    flightSeats.forEach((fs, i) => {
      seatArrays[i] = (fs.rn + fs.cn).replace(/\s+/g, '');
    });
  }
  // 给绑定婴儿显示字段赋值
  const sqlIn = 'select pl.* from dcs_pl pl where  pl.wc = 1 and pl.pty=\'inf\' and pl.wde =0 and pl.lu = ? ';
  const infs = queryForList(sqlIn, [lu]);
  const inArrays = [];
  if (infs && infs.length > 0) {
    infs.forEach((inf) => {
      if (inf.rau = 0 && inf.rau) {
        inArrays[inf.rau] = inf.cn;
      }
    });
  }
  // // /给绑定旅客行李属性
  // const pbsql = 'select plu,bn from dcs_fb where wde = 0 and lu = ? ';
  // const pbs = queryForList(pbsql, [lu]);
  // const pbmap = {};
  // if (pbs && pbs.length > 0) {
  //   pbs.forEach((pb) => {
  //     if (pbmap[pb.lu]) {
  //       const v = `${pbmap[pb.lu]}/${pb.bn}`;
  //       pbmap[pb.lu] = v;
  //     } else {
  //       pbmap[pb.lu] = pb.bn;
  //     }
  //   });
  // }
  if (ps && ps.length > 0) {
    ps.forEach((passenger) => {
      const name = inArrays[passenger.uui];
      if (name != null) { // 婴儿姓名显示
        passenger.name = name;
      }
      // const pbn = pbmap[passenger.uui];
      // if (pbn != null) { // 绑定旅客行李属性
      //   passenger.bagn = pbn;
      // }
      const f = seatArrays.indexOf(passenger.sea) > 0 ? 1 : 0;
      if (f != null) { // 座位冲突标记
        passenger.wsc = f;
      }
      passenger.ovy = getFl(passenger.uui);
      passenger.dpt = getNameByCode(passenger.dpt); // 证件中文名称
      passenger.cs = getCin(passenger.cs); // 旅客值机序号改为3位
    });
  }
  return ps;
}
function getCin(cs) {
  const temp = `000${cs}`;
  return temp.substring(temp.length - 3, temp.length);
}
/**
 * 添加航段属性
 */
function getFl(uui) {
  const nlusql = 'select sde, sar, nlu from dcs_pl where uui = ? ';
  const nludata = queryForObject(nlusql, [uui]);
  const arrays = [];
  arrays[0] = nludata.sde;
  arrays[1] = nludata.sar;

  let fls = queryForObject('select  sde, sar, nlu from dcs_fl where uui=?', [nludata.nlu]);
  if (fls.length > 0) {
    while (fls.nlu && fls.nlu > 0) {
      arrays[arrays.length] = fls.sar;
      fls = queryForList('select  sde, sar, nlu from dcs_fl where uui=?', [fls.nlu]);
    }
  }
  return arrays;
}
/**
 * 证件中文名转换
 * @param dt 证件名称
 * @returns {*}
 */
function getNameByCode(dt) {
  const dptMap = {
    0: '无',
    I: '身份证',
    P: '护照',
    T: '台胞证',
    4: '军官证',
    6: '警官证',
    7: '离退休干部证',
    8: '部队离退休证',
    9: '士兵证',
    5: '户口薄',
    C: '回乡证',
    PT: '旅行证',
    PL: '外侨证',
    W: '港澳通行证',
    AC: '空服员证件',
    D: '台湾通行证',
    S: '海员证',
    // D: '大陆往来台湾通行证',
  };
  if (dptMap.dt) {
    return dptMap.dt;
  } else {
    return dt;
  }
}
/**
 * queryTopic
 * @param lu
 * @returns {{}}
 */
function queryTopic(lu) {
  let count = 0;
  const sql = 'select distinct pl.*, ' +
          '(select sum(cha) from dcs_fee t1 where pl.pn = t1.plu and wde =0 and cty in (1,2)) yzsf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.pn = t1.plu and wde =0 and cty =3) ztcf, ' +
          '(select sum(cha) from dcs_fee t1 where pl.pn = t1.plu and wde =0 and cty =4) kdjf, ' +
          't2.cna rin, pl.pst pst,fb.bn  ' +
          'from dcs_pl pl left join dcs_pl t2 on pl.rpn = t2.pn and t2.wde =0 ' +
          ' left join  dcs_fb fb on pl.uui = fb.plu ' +
          'where pl.lu=? and pl.wde=0 order by pl.ena';

  const passengerViews = queryForList(sql, [lu]);
  const passengerViews1 = {};
  passengerViews.forEach((pss) => {
    if ('del'.toLowerCase() !== pss.oat && (pss.ws || pss.pst)) {
      passengerViews1[count] = pss;
      count += 1;
    }
  });
  return passengerViews1;
}

function sqlByName(names, params, sqlBuild) {
  for (let i = 0; i < names.length; i += 1) {
    if (i > 0) {
      sqlBuild += ' or pl.ena like ';
    }
    sqlBuild += '?';
    params[i] = `${names[i]}%`;
  }
  return { params, sqlBuild };
}
/**
 * 查询条件处理
 *
 * @param ids           id拼接串
 * @param params        参数列表
 * @param stringBuilder sql语句
 */
function setSql(orns, params, sqlBuild) {
  for (let i = 0; i < orns.length; i += 1) {
    if (i > 0) {
      sqlBuild += ',';
    }
    params[i] = orns[i];
    sqlBuild += '?';
  }
  return { orns, params, sqlBuild };
}

/**
 * 额外占座匹配查询
 *
 * @param list
 * @param result
 * @param seas
 */
function addSeatPassenger(lists, result, seas) {
  for (let i = 0; i < lists.length; i += 1) {
    if (!(lists[i].es) || lists[i].es.replace(/\s+/g, '').length) {
      break;
    }
    const seas2 = lists[i].es.split(',');
    for (let j = 0; j < seas2.length; j += 1) {
      if (seas.indexOf(seas2[j]) >= 0) {
        result[i] = lists[i];
        i += 1;
        break;
      }
    }
  }
}

function getSeatsByLine(seas, seats, params) {
  let k = 0;
  seas.forEach((s) => {
    seats[k * 6] = `${s}a`;
    params[k * 6] = `${s}a`;
    seats[(k * 6) + 1] = `${s}b`;
    params[(k * 6) + 1] = `${s}b`;
    seats[(k * 6) + 2] = `${s}c`;
    params[(k * 6) + 2] = `${s}c`;
    seats[(k * 6) + 3] = `${s}d`;
    params[(k * 6) + 3] = `${s}d`;
    seats[(k * 6) + 4] = `${s}e`;
    params[(k * 6) + 4] = `${s}e`;
    seats[(k * 6) + 5] = `${s}f`;
    params[(k * 6) + 5] = `${s}f`;
    k += 1;
  });
}

function addToResult(lists, result) {
  let n = 0;
  for (let i = 0; i < lists.length; i += 1) {
    let f = true;
    for (let j = 0; j < result.length; j += 1) {
      if (lists[i].uui === result[i].uui) {
        f = false;
        break;
      }
    }
    if (f) {
      result[result.length + n] = lists[i];
      n += 1;
    }
  }
}
function passengersPaiXu(result) {
  for (let i = result.length - 1; i > 0; i -= 1) {
    for (let k = i; k > 0; k -= 1) {
      if (result[k].ena === result[k - 1].ena) {
        const temp = result[k];
        result[k] = result[k - 1];
        result[k - 1] = temp;
      }
    }
  }
}
