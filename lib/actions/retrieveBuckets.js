const MaesterClient = require('../client');

exports.process = async function processAction(msg, cfg) {
  this.logger.info('Executing retrieve buckets action');
  const client = new MaesterClient(this, cfg);
  let { bucketId, externalId } = msg.body;

  if (bucketId === undefined) {
    bucketId = '';
  }
  
  if (externalId === undefined) {
    externalId = '';
  } else {
    externalId = `?externalid=${externalId}`;
  }

  const result = await client.makeRequest({
    url: `/buckets/${bucketId}${externalId}`,
    method: 'GET',
  });

  this.logger.debug(`Emitting data: ${JSON.stringify(result)}`);
  return { body: result };
};
