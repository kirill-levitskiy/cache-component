/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const sinon = require('sinon');
const nock = require('nock');
const logger = require('@elastic.io/component-logger')();
const action = require('../lib/actions/storeObjects');

const cfg = {};

const postMsg = {
  body: {
    key: 'status',
    value: 'New',
  },
};

const putMsg = {
  body: {
    key: 'status',
    value: 'Pending',
    objectId: '4b7acb72-4c9b-4206-841a-22f919c5b352',
  },
};

const postMsgBucket = {
  body: {
    key: 'status',
    value: 'New',
    bucketId: '5e7fc461fefbf30013afdc8e',
  },
};

const self = {
  emit: sinon.spy(),
  logger,
};

describe('store objects', () => {
  let result;

  before(async () => {
    process.env.ELASTICIO_OBJECT_STORAGE_URI = 'http://maester-service.platform.svc.cluster.local:3002';
    process.env.ELASTICIO_OBJECT_STORAGE_TOKEN = 'token';
  });

  it('post - store object', async () => {
    nock(process.env.ELASTICIO_OBJECT_STORAGE_URI)
      .post('/objects/', postMsg.body).reply(200, postMsg.body);
    nock(process.env.ELASTICIO_OBJECT_STORAGE_URI)
      .get(`/buckets/${postMsgBucket.body.bucketId}`).reply(200, {
        id: '5e7fc461fefbf30013afdc8e',
        objects: [
          '9fda5050-7760-4fb5-b36b-37502fe546d7',
        ],
        closed: false,
        createdAt: 1585431649053,
      });
    nock(process.env.ELASTICIO_OBJECT_STORAGE_URI)
      .get('/objects/9fda5050-7760-4fb5-b36b-37502fe546d7').reply(200, {
        key: 'isClosed',
        value: false,
      });
    nock(process.env.ELASTICIO_OBJECT_STORAGE_URI)
      .post('/objects/', { key: 'status' }).reply(200, { key: 'status' });

    result = await action.process.call(self, postMsg, cfg);
    expect(result.body).to.have.all.keys('key', 'value');
  });

  it('put - store object', async () => {
    nock(process.env.ELASTICIO_OBJECT_STORAGE_URI)
      .put(`/objects/${putMsg.body.objectId}`, putMsg.body).reply(200, putMsg.body);
    nock(process.env.ELASTICIO_OBJECT_STORAGE_URI)
      .get(`/buckets/${postMsgBucket.body.bucketId}`).reply(200, {
        id: '5e7fc461fefbf30013afdc8e',
        objects: [
          '9fda5050-7760-4fb5-b36b-37502fe546d7',
        ],
        closed: false,
        createdAt: 1585431649053,
      });
    nock(process.env.ELASTICIO_OBJECT_STORAGE_URI)
      .get('/objects/9fda5050-7760-4fb5-b36b-37502fe546d7').reply(200, {
        key: 'isClosed',
        value: false,
      });
    nock(process.env.ELASTICIO_OBJECT_STORAGE_URI)
      .put('/objects/', { key: 'status' }).reply(200, { key: 'status' });

    result = await action.process.call(self, putMsg, cfg);
    expect(result.body).to.have.all.keys('key', 'value', 'objectId');
  });

  it('post - store object in a bucket', async () => {
    nock(process.env.ELASTICIO_OBJECT_STORAGE_URI)
      .post('/objects/', postMsgBucket.body).reply(200, postMsgBucket.body);
    nock(process.env.ELASTICIO_OBJECT_STORAGE_URI)
      .get(`/buckets/${postMsgBucket.body.bucketId}`).reply(200, {
        id: '5e7fc461fefbf30013afdc8e',
        objects: [
          '9fda5050-7760-4fb5-b36b-37502fe546d7',
        ],
        closed: false,
        createdAt: 1585431649053,
      });
    nock(process.env.ELASTICIO_OBJECT_STORAGE_URI)
      .get('/objects/9fda5050-7760-4fb5-b36b-37502fe546d7').reply(200, {
        key: 'isClosed',
        value: false,
      });
    nock(process.env.ELASTICIO_OBJECT_STORAGE_URI)
      .post('/objects/', { key: 'status' }).reply(200, { key: 'status' });

    result = await action.process.call(self, postMsgBucket, cfg);
    expect(result.body).to.have.all.keys('key', 'value', 'bucketId');
  });
});
