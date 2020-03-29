/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const sinon = require('sinon');
const nock = require('nock');
const logger = require('@elastic.io/component-logger')();
const action = require('../lib/actions/removeObjects');

const cfg = {};

const msg = {
  body: {
    objectId: '9fda5050-7760-4fb5-b36b-37502fe546d7',
  },
};

const self = {
  emit: sinon.spy(),
  logger,
};

describe('remove objects', () => {
  let result;

  before(async () => {
    process.env.ELASTICIO_OBJECT_STORAGE_URI = 'http://maester-service.platform.svc.cluster.local:3002';
    process.env.ELASTICIO_OBJECT_STORAGE_TOKEN = 'token';
  });

  it('remove object', async () => {
    nock('http://maester-service.platform.svc.cluster.local:3002')
      .delete(`/objects/${msg.body.objectId}`).reply(200, msg.body);
    result = await action.process.call(self, msg, cfg);
    expect(result.body).to.have.all.keys('objectId');
  });
});
