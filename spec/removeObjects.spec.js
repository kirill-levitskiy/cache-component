/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const sinon = require('sinon');
const nock = require('nock');
const { messages } = require('elasticio-node');
const logger = require('@elastic.io/component-logger')();
const action = require('../lib/actions/removeObjects');

const cfg = {
  resourceServerUrl: 'http://maester-service.platform.svc.cluster.local:3002',
  apiKeyHeaderName: 'Authorization',
  apiKeyHeaderValue: 'token',
};

const msg = {
  body: {
    key: '1',
  },
};

const self = {
  emit: sinon.spy(),
  logger,
};

describe('remove objects', () => {
  let lastCall;

  beforeEach(async () => {
    lastCall.reset();
  });

  before(async () => {
    process.env.ELASTICIO_OBJECT_STORAGE_URI = 'http://maester-service.platform.svc.cluster.local:3002';
    process.env.ELASTICIO_OBJECT_STORAGE_TOKEN = 'token';

    lastCall = sinon.stub(messages, 'newMessageWithBody')
      .returns(Promise.resolve());
  });

  after(async () => {
    messages.newMessageWithBody.restore();
  });

  it('remove object', async () => {
    nock('http://maester-service.platform.svc.cluster.local:3002')
      .delete(`/objects/${msg.body.key}`).reply(200, msg.body);
    await action.process.call(self, msg, cfg);
    expect(self.emit.calledOnce).to.be.true;
  });
});
