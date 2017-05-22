import { queryForList, queryForObject } from '../utils/DbUtil';

export async function query() {
  return await queryForList('select * from dcs_node');
}

export async function queryById() {
  return await queryForObject('select * from dcs_node where id=?', [1]);
}
