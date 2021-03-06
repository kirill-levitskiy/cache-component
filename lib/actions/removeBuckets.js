const MaesterClient = require('../client');

exports.process = async function processAction(msg, cfg) {
  this.logger.info('Executing remove buckets action');
  const client = new MaesterClient(this, cfg);

  const result = await client.makeRequest({
    url: `/buckets/${msg.body.bucketId}`,
    method: 'DELETE',
  });

  this.logger.debug(`Emitting data: ${JSON.stringify(result)}`);
  return { body: result };
};
