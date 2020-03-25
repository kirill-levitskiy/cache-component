const { ApiKeyRestClient } = require('@elastic.io/component-commons-library');

module.exports = class MaesterClient extends ApiKeyRestClient {
  constructor(emitter, cfg) {
    super(emitter, cfg);
    this.cfg = cfg;
    this.cfg.resourceServerUrl = process.env.ELASTICIO_OBJECT_STORAGE_URI;
    this.cfg.apiKeyHeaderName = 'Authorization';
    this.cfg.apiKeyHeaderValue = `Bearer ${process.env.ELASTICIO_OBJECT_STORAGE_TOKEN}`;
    this.authRestClient = new ApiKeyRestClient(emitter, cfg);
  }
};
