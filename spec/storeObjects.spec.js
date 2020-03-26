/* eslint-disable no-unused-expressions */

const fs = require('fs');
const { expect } = require('chai');
const sinon = require('sinon');
const nock = require('nock');
const { messages } = require('elasticio-node');
const logger = require('@elastic.io/component-logger')();
const action = require('../lib/actions/storeObjects');

const cfg = {
  resourceServerUrl: 'http://maester-service.platform.svc.cluster.local:3002',
  apiKeyHeaderName: 'auth',
  apiKeyHeaderValue: 'token',
};

const msg = {
  body: {
    key: 'status',
    value: 'Pending',
  },
};

const self = {
  emit: sinon.spy(),
  logger,
};

describe('store objects', () => {
  let lastCall;

  beforeEach(async () => {
    lastCall.reset();
  });

  before(async () => {
    if (fs.existsSync('.env')) {
      // eslint-disable-next-line global-require
      require('dotenv').config();
    }

    lastCall = sinon.stub(messages, 'newMessageWithBody')
      .returns(Promise.resolve());
  });

  after(async () => {
    messages.newMessageWithBody.restore();
  });

  it('store object', async () => {
    nock('http://maester-service.platform.svc.cluster.local:3002')
      .post('/buckets/', { objects: [] }).reply(201, {
        statusCode: 201,
        body: {
          id: '5e7bbaa4304d6c00150a5aa1',
          objects: [],
          closed: false,
          createdAt: 1585167012881,
        },
      });
    nock('http://maester-service.platform.svc.cluster.local:3002')
      .post('/objects/', msg.body).reply(200, msg.body);
    await action.process.call(self, msg, cfg);
    expect(self.emit.calledOnce).to.be.true;
  });
});
