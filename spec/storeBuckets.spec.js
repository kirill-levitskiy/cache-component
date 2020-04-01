/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const sinon = require('sinon');
const nock = require('nock');
const logger = require('@elastic.io/component-logger')();
const action = require('../lib/actions/storeBuckets');

const cfg = {};

const msg = {
  body: {
    externalId: 'test',
  },
};

const self = {
  emit: sinon.spy(),
  logger,
};

describe('store buckets', () => {
  let result;

  before(async () => {
    process.env.ELASTICIO_OBJECT_STORAGE_URI = 'http://maester-service.platform.svc.cluster.local:3002';
    process.env.ELASTICIO_OBJECT_STORAGE_TOKEN = 'token';
  });

  it('store bucket', async () => {
    nock('http://maester-service.platform.svc.cluster.local:3002')
      .post('/buckets/', {
        objects: [],
        externalId: 'test',
      }).reply(201, {
        objects: [],
        externalId: 'test',
      });
    result = await action.process.call(self, msg, cfg);
    expect(result).to.have.all.keys('body');
  });
});
