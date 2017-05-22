import { expect } from 'chai';
import * as NodeService from '../services/node-service';
import * as DbUtil from '../utils/DbUtil';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('node service', () => {
  before(() => {
    DbUtil.loadDbForTest();
  });

  it('query node', async () => {
    const nodes = await NodeService.query();
    console.log(nodes);
    expect(nodes).to.have.length.of.at.least(1);
  });

  it('query one node', async () => {
    const node = await NodeService.queryById(1);
    console.log(node);

    expect(node).to.be.not.null;
  });
});
