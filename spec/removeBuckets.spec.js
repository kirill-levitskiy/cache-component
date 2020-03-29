/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const sinon = require('sinon');
const nock = require('nock');
const logger = require('@elastic.io/component-logger')();
const action = require('../lib/actions/removeBuckets');

const cfg = {};

const msg = {
  body: {
    bucketId: '5e7fc461fefbf30013afdc8e',
  },
};

const self = {
  emit: sinon.spy(),
  logger,
};

describe('remove buckets', () => {
  let result;

  before(async () => {
    process.env.ELASTICIO_OBJECT_STORAGE_URI = 'http://maester-service.platform.svc.cluster.local:3002';
    process.env.ELASTICIO_OBJECT_STORAGE_TOKEN = 'token';
  });

  it('remove bucket', async () => {
    nock('http://maester-service.platform.svc.cluster.local:3002')
      .delete(`/buckets/${msg.body.bucketId}`).reply(200, msg.body);
    result = await action.process.call(self, msg, cfg);
    expect(result.body).to.have.all.keys('bucketId');
  });
});
