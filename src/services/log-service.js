/**
 * 日志查询相关
 * Created by 010794 on 2017/5/9.
 */

import { queryForList } from '../utils/DbUtil';


export function query(cmd, uuis) {
  let sql = 'select * from dcs_log where ';
  if (cmd) {
    cmd.toLowerCase();
    if (cmd.startsWith('/baglsb')) { // 查看商务行李操作日志 /baglsb
      sql += ' ot = 4';
    } else if (cmd.startsWith('/opr')) { // 工号操作日志查询 /opr 工号
      const s = cmd.replace('/opr', '').trim();
      sql += ` lmb = '${s}'`;
    } else if (cmd.startsWith('/log')) { // 当前航班航班日志查询 /log
      sql += ' ot in (1,4)';
    } else if (cmd.startsWith('/syslog')) { // 查询系统日志 /syslog
      sql += ' ot = 3';
    }
  } else if (cmd === null && uuis.length > 0) { // 查询某一旅客日志(任意旅客可多选) 传入旅客uui数组
    let ss = '(';
    uuis.forEach((uui, i) => {
      if (i < uuis.length - 1) {
        ss += `${uuis[i]},`;
      } else {
        ss += `${uuis[i]})`;
      }
    });
    sql += ` ot = 2 and plu in ${ss}`;
  }
  console.info(`当前sql:${sql}`);
  return queryForList(sql);
}
