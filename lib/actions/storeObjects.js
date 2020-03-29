const MaesterClient = require('../client');

exports.process = async function processAction(msg, cfg) {
  this.logger.info('Executing store objects action');
  const client = new MaesterClient(this, cfg);
  const { bucketId, key } = msg.body;
  let { objectId } = msg.body;
  let options;
  let xMetaBucket;

  if (bucketId !== undefined) {
    xMetaBucket = { 'x-meta-bucket': bucketId };
  }

  /* start workaround - save mapping objectId = key in the special bucket */
  const mappingBucketKey = '5e7fc461fefbf30013afdc8e';
  // get all keys from the bucket
  const resultAllKeys = await client.makeRequest({
    url: `/buckets/${mappingBucketKey}`,
    method: 'GET',
  });

  const { objects } = resultAllKeys;

  // eslint-disable-next-line no-restricted-syntax
  for (const objId of objects) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const resultObjKey = await client.makeRequest({
        url: `/objects/${objId}`,
        method: 'GET',
      });
      // get objectId by key
      if (resultObjKey.key === msg.body.key) {
        objectId = objId;
        break;
      }
    } catch (e) {
      this.logger.debug(`ObjectID ${objId} was not found, it has been deleted`);
    }
  }
  if (!objectId) {
    // store a new key
    const mappingBucketOptions = {
      url: '/objects/',
      method: 'POST',
      headers: { 'x-meta-bucket': mappingBucketKey },
      body: { key },
    };
    // eslint-disable-next-line no-await-in-loop
    await client.makeRequest(mappingBucketOptions);
  }
  /* end workaround */

  if (objectId !== undefined) {
    options = {
      url: `/objects/${objectId}`,
      method: 'PUT',
      headers: xMetaBucket,
      body: msg.body,
    };
  } else {
    options = {
      url: '/objects/',
      method: 'POST',
      headers: xMetaBucket,
      body: msg.body,
    };
  }

  const result = await client.makeRequest(options);

  this.logger.debug(`Emitting data: ${JSON.stringify(result)}`);
  return { body: result };
};
