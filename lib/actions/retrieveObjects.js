const MaesterClient = require('../client');

exports.process = async function processAction(msg, cfg) {
  this.logger.info('Executing retrieve objects action');
  const client = new MaesterClient(this, cfg);
  const { key } = msg.body;
  let { objectId, external_id } = msg.body;

  if (external_id === undefined) {
    external_id = '';
  } else {
    external_id = `?external_id=${external_id}`
  }

  if (objectId === undefined && key === undefined) {
    throw new Error('Required one of following input arguments: Key or Object ID');
  }

  /* start workaround - save mapping objectId = key in the special bucket */
  if (key !== undefined) {
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
          url: `/objects/${objId}${external_id}`,
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
    if (objectId === undefined) {
      throw new Error(`Object with Key ${key} was not found`);
    }
  }
  /* end workaround */

  const result = await client.makeRequest({
    url: `/objects/${objectId}?`,
    method: 'GET',
  });

  if (cfg.deleteRequired) {
    await client.makeRequest({
      url: `/objects/${objectId}`,
      method: 'DELETE',
    });
  }

  this.logger.debug(`Emitting data: ${JSON.stringify(result)}`);
  return { body: { data: { result }, objectId } };
};
