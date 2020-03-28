/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const sinon = require('sinon');
const logger = require('@elastic.io/component-logger')();
const storeAction = require('../lib/actions/storeObjects');
const retrieveAction = require('../lib/actions/retrieveObjects');

const cfg = {};

const storeMsg = {
  body: {
    key: 'test',
    value: 'test',
  },
};

const self = {
  emit: sinon.spy(),
  logger,
};

describe('store objects', () => {
  let storeResult;
  let retrieveResult;

  before(async () => {
    process.env.ELASTICIO_OBJECT_STORAGE_URI = 'http://127.0.0.1:3002';
    process.env.ELASTICIO_OBJECT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IjU2YzIwN2FkYjkxMjExODFlNjUwYzBlZiIsImNvbnRyYWN0SWQiOiI1YzIyMGQ3YTIxMzI0MDAwMTI0YzljYjgiLCJ3b3Jrc3BhY2VJZCI6IjVjMjIwZDdhMjEzMjQwMDAxMjRjOWNiYSIsImZsb3dJZCI6IjVlN2UxNTA1Mjc2M2FhMDAxNDZjZGVmOSIsInVzZXJJZCI6IjVjMjIwZDdhMjEzMjQwMDAxMjRjOWNiNyIsImlhdCI6MTU4NTMyMTIyMX0.UIZR1Ra6VhI-bnkjNm3W2ohaf1xjci4bTU6EL5GQut4';
  });

  it('store object', async () => {
    storeResult = await storeAction.process.call(self, storeMsg, cfg);
    expect(storeResult.body).to.have.all.keys('contentLength', 'contentType', 'createdAt', 'md5', 'metadata', 'objectId');
  });

  it('retrieve object', async () => {
    const { objectId } = storeResult.body;
    retrieveResult = await retrieveAction.process.call(self, { body: { key: objectId } }, cfg);
    expect(retrieveResult.body).to.have.all.keys('key', 'value');
  });
});


