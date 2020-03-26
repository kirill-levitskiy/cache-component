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
  this.logger.trace(`Create bucket result: ${JSON.stringify(createdBucket)}`);

  if (createdBucket.statusCode !== 201) {
    throw new Error(`Failed to create bucket: ${createdBucket.statusCode}`);
  }

  const uri = process.env.ELASTICIO_OBJECT_STORAGE_URI;
  const token = process.env.ELASTICIO_OBJECT_STORAGE_TOKEN;
  this.logger.info(`config: ${token} ${uri}`);

  // create bucket
  /*
  const res = await request({
    uri: `${uri}/buckets/`,
    auth: {
      bearer: token,
    },
    method: 'POST',
    json: true,
    body: { objects: [] },
  });
  if (res.statusCode !== 201) {
    throw new Error(`Failed to create bucket: ${JSON.stringify(res)}`);
  }
  */

  const result = await client.makeRequest({
    url: '/objects/',
    method: 'POST',
    headers: {
      'x-meta-bucket': createdBucket.body.id,
    },
    body: msg.body,
  });

  this.logger.trace(`Emitting data: ${JSON.stringify(result)}`);
  await this.emit('data', messages.newMessageWithBody({
    body: result,
  }));
};
