/* eslint-disable no-param-reassign */

const { ApiKeyRestClient } = require('@elastic.io/component-commons-library');

module.exports = class MaesterClient extends ApiKeyRestClient {
  constructor(emitter, cfg) {
    cfg.resourceServerUrl = process.env.ELASTICIO_OBJECT_STORAGE_URI;
    cfg.apiKeyHeaderName = 'Authorization';
    cfg.apiKeyHeaderValue = `Bearer ${process.env.ELASTICIO_OBJECT_STORAGE_TOKEN}`;
    super(emitter, cfg);
    this.authRestClient = new ApiKeyRestClient(emitter, cfg);
  }
};
