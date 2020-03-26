const { messages } = require('elasticio-node');
const MaesterClient = require('../client');

exports.process = async function processAction(msg, cfg) {
  const client = new MaesterClient(this, cfg);

  const result = await client.makeRequest({
    url: '/objects/',
    method: 'GET',
  });

  await this.emit('data', messages.newMessageWithBody({
    body: result.body,
  }));
};
