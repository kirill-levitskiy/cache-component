const { messages } = require('elasticio-node');
const MaesterClient = require('../client');

exports.process = async function processAction(msg, cfg) {
  this.logger.info('Executing remove objects action');
  const client = new MaesterClient(this, cfg);

  const result = await client.makeRequest({
    url: `/objects/${msg.body.key}`,
    method: 'DELETE',
  });

  this.logger.debug(`Emitting data: ${JSON.stringify(result)}`);
  return messages.newMessageWithBody(result);
};
