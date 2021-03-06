const MaesterClient = require('../client');

exports.process = async function processAction(msg, cfg) {
  this.logger.info('Executing store buckets action');
  const client = new MaesterClient(this, cfg);
  const { externalId } = msg.body;

  const result = await client.makeRequest({
    url: '/buckets/',
    method: 'POST',
    body: { objects: [], externalId },
  });

  this.logger.debug(`Emitting data: ${JSON.stringify(result)}`);
  return { body: result };
};
