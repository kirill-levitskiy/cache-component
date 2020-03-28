/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const sinon = require('sinon');
const nock = require('nock');
const logger = require('@elastic.io/component-logger')();
const action = require('../lib/actions/retrieveObjects');

const cfg = {};

const msg = {
  body: {
    key: '4b7acb72-4c9b-4206-841a-22f919c5b352',
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

  it('retrieve object', async () => {
    nock('http://maester-service.platform.svc.cluster.local:3002')
      .get(`/objects/${msg.body.key}`).reply(200);
    result = await action.process.call(self, msg, cfg);
    expect(result).to.have.all.keys('id', 'body', 'attachments', 'headers', 'metadata');
  });
});
