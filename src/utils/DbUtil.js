/**
 * Sqlite数据库相关操作
 */
import SQL from 'sql.js';
import Ctx from './Context';
import { request } from './RequestUtil';

/**
 * 加载客户端Sqlite数据库，仅用于单元测试（采用node fs类库，浏览器不可用）
 */
export function loadDbForTest() {
  const dbFile = `./src/tests/${Ctx.dbfile}`;
  const fs = require('fs');
  global.window = {};
  window.DB = new SQL.Database(fs.readFileSync(dbFile));
}

/**
 * 检查数据库是否加载（加载到window.DB），没有加载则抛出异常
 */
export function checkDB() {
  if (!window.DB) throw 'database not load';
}

/**
 * 查询本地Sqlite数据库，返回单个对象
 * @param sql {String}
 * @param params {Array}
 */
export async function queryForObject(sql, params, lu) {
  if (Ctx.isNode()) {
    checkDB();
    const stmt = window.DB.prepare(sql);
    if (params) {
      stmt.bind(params);
    }
    stmt.step();
    const r = stmt.getAsObject();
    stmt.free();

    return r;
  } else if (Ctx.useJb) { // 在jxbrowser外壳包裹下
    const syncResult = await syncBeforeQuery(lu);
    if (!syncResult) {
      console.error('do sync before query error');
    }

    const r = Ctx.db.queryForObject(sql, JSON.stringify(params));
    if (r && r.isSuccess()) {
      return r.getMsg();
    }
    throw r && r.getMsg();
  } else {
    return request('http://192.168.9.108:9999/local/db/queryForObject', {
      method: 'get',
      absoluteUrl: true,
      data: {
        sql,
        params: JSON.stringify(params),
      },
    });
  }
}

/**
 * 查询本地Sqlite数据库，返回对象数组Array  eg:queryForList('select * from dcs_user where wid=:wid and pms=:pms',['000001',20])
 * @param sql {String}
 * @param params {Array}
 * @returns {Array}
 */
export async function queryForList(sql, params, lu) {
  if (Ctx.isNode()) { // 在Node环境下，本地debug时使用
    checkDB();

    const stmt = window.DB.prepare(sql);
    if (params) {
      stmt.bind(params);
    }
    const r = [];
    while (stmt.step()) {
      r.push(stmt.getAsObject());
    }
    stmt.free();

    return r;
  } else if (Ctx.useJb) { // 在jxbrowser外壳包裹下，正式发布后使用
    const syncResult = await syncBeforeQuery(lu);
    if (!syncResult) {
      console.error('do sync before query error');
    }

    const r = Ctx.db.queryForList(sql, JSON.stringify(params));
    if (r && r.isSuccess()) {
      return r.getMsg();
    }
    throw r && r.getMsg();
  } else { // UI开发 使用请求测试服务
    return request('http://192.168.9.108:9999/local/db/queryForList', {
      method: 'get',
      absoluteUrl: true,
      data: {
        sql,
        params: JSON.stringify(params),
      },
    });
  }
}

async function syncBeforeQuery(lu) {
  const r = Ctx.db.genParams(Ctx.appId, Ctx.airportCode, lu);

  if (r && r.isSuccess()) {
    const checkResult = await request('/version/check', {
      method: 'get',
      data: JSON.stringify(r.getMsg()),
    });

    if (checkResult && checkResult.success) {
      const syncResult = Ctx.db.syncLocal(checkResult.obj);
      if (syncResult && syncResult.isSuccess()) {
        console.log('sync before query complete!');
        return true;
      }
    }
  }
}

