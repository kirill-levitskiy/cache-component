const { messages } = require('elasticio-node');
const MaesterClient = require('../client');

exports.process = async function processAction(msg, cfg) {
  const client = new MaesterClient(this, cfg);

  // create bucket
  const createdBucket = await client.makeRequest({
    url: '/buckets/',
    method: 'POST',
    body: { objects: [] },
  });

  if (createdBucket.statusCode !== 201) {
    throw new Error(`Failed to create bucket: ${createdBucket.statusCode}`);
  }

  const result = await client.makeRequest({
    url: '/objects/',
    method: 'POST',
    headers: {
      'x-meta-bucket': createdBucket.body.id,
    },
    body: msg.body,
  });

  return this.emit('data', messages.newMessageWithBody({
    result,
  }));
};
