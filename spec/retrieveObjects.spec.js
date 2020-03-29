/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const sinon = require('sinon');
const nock = require('nock');
const logger = require('@elastic.io/component-logger')();
const action = require('../lib/actions/retrieveObjects');

const cfg = {};

const msg = {
  body: {
    key: 'status',
  },
};

const self = {
  emit: sinon.spy(),
  logger,
};

describe('retrieve objects', () => {
  let result;

  before(async () => {
    process.env.ELASTICIO_OBJECT_STORAGE_URI = 'http://maester-service.platform.svc.cluster.local:3002';
    process.env.ELASTICIO_OBJECT_STORAGE_TOKEN = 'token';
  });

  it('retrieve object by key', async () => {
    nock('http://maester-service.platform.svc.cluster.local:3002')
      .get('/objects/9fda5050-7760-4fb5-b36b-37502fe546d7').reply(200, { key: 'status' });
    nock(process.env.ELASTICIO_OBJECT_STORAGE_URI)
      .get('/buckets/5e7fc461fefbf30013afdc8e').reply(200, {
        id: '5e7fc461fefbf30013afdc8e',
        objects: [
          '9fda5050-7760-4fb5-b36b-37502fe546d7',
        ],
        closed: false,
        createdAt: 1585431649053,
      });
    nock('http://maester-service.platform.svc.cluster.local:3002')
      .get('/objects/9fda5050-7760-4fb5-b36b-37502fe546d7').reply(200, { key: 'status' });

    result = await action.process.call(self, msg, cfg);
    expect(result).to.have.all.keys('body');
  });
});
