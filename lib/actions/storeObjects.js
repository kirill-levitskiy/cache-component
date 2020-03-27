const { messages } = require('elasticio-node');
const MaesterClient = require('../client');

exports.process = async function processAction(msg, cfg) {
  this.logger.info('Executing store objects action');
  const client = new MaesterClient(this, cfg);

  // create bucket
  const createdBucket = await client.makeRequest({
    url: '/buckets/',
    method: 'POST',
    body: { objects: [] },
  });
  this.logger.debug(`Created bucket: ${createdBucket.id}`);

  const result = await client.makeRequest({
    url: '/objects',
    method: 'POST',
    headers: {
      'x-meta-bucket': createdBucket.id,
    },
    body: msg.body,
  });

  this.logger.debug(`Emitting data: ${JSON.stringify(result)}`);
  await this.emit('data', messages.newMessageWithBody({
    body: result,
  }));
};
