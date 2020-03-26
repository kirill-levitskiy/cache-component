const { ApiKeyRestClient } = require('@elastic.io/component-commons-library');

module.exports = class MaesterClient extends ApiKeyRestClient {
  constructor(emitter, cfg) {
    super(emitter, cfg);
    this.cfg = cfg;
    this.cfg.resourceServerUrl = process.env.ELASTICIO_OBJECT_STORAGE_URI || cfg.resourceServerUrl;
    this.cfg.apiKeyHeaderName = 'authorization';
    this.cfg.apiKeyHeaderValue = `Bearer ${(process.env.ELASTICIO_OBJECT_STORAGE_TOKEN || cfg.apiKeyHeaderValue)}`;
    emitter.logger.debug(`resourceServerUrl: ${this.cfg.resourceServerUrl}`);
    emitter.logger.debug(`apiKeyHeaderValue: ${this.cfg.apiKeyHeaderValue}`);
    this.authRestClient = new ApiKeyRestClient(emitter, cfg);
  }
};
