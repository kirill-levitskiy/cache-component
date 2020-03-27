/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const sinon = require('sinon');
const { messages } = require('elasticio-node');
const logger = require('@elastic.io/component-logger')();
const action = require('../lib/actions/retrieveObjects');

const cfg = {};

const msg = {
  body: {
    key: 'e995a42d-40e6-4d02-acc9-0f1ccba4387f',
  },
};

const self = {
  emit: sinon.spy(),
  logger,
};

describe('retrieve objects', () => {
  let lastCall;

  beforeEach(async () => {
    lastCall.reset();
  });

  before(async () => {
    process.env.ELASTICIO_OBJECT_STORAGE_URI = 'http://127.0.0.1:3002';
    process.env.ELASTICIO_OBJECT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IjU2YzIwN2FkYjkxMjExODFlNjUwYzBlZiIsImNvbnRyYWN0SWQiOiI1YzIyMGQ3YTIxMzI0MDAwMTI0YzljYjgiLCJ3b3Jrc3BhY2VJZCI6IjVjMjIwZDdhMjEzMjQwMDAxMjRjOWNiYSIsImZsb3dJZCI6IjVlN2UxNTA1Mjc2M2FhMDAxNDZjZGVmOSIsInVzZXJJZCI6IjVjMjIwZDdhMjEzMjQwMDAxMjRjOWNiNyIsImlhdCI6MTU4NTMyMTIyMX0.UIZR1Ra6VhI-bnkjNm3W2ohaf1xjci4bTU6EL5GQut4';

    lastCall = sinon.stub(messages, 'newMessageWithBody')
      .returns(Promise.resolve());
  });

  after(async () => {
    messages.newMessageWithBody.restore();
  });

  it('retrieve object', async () => {
    await action.process.call(self, msg, cfg);
    expect(self.emit.calledOnce).to.be.true;
  });
});
