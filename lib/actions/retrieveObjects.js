const { messages } = require('elasticio-node');
const MaesterClient = require('../client');

exports.process = async function processAction(msg, cfg) {
  this.logger.info('Executing retrieve objects action');
  const client = new MaesterClient(this, cfg);

  const result = await client.makeRequest({
    url: `/objects/${msg.body.key}`,
    headers: {
      'x-meta-bucket': msg.body.keyBucket,
    },
    method: 'GET',
  });

  this.logger.debug(`Emitting data: ${JSON.stringify(result)}`);
  await this.emit('data', messages.newMessageWithBody(result));
};
