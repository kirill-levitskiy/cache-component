const { ApiKeyRestClient } = require('@elastic.io/component-commons-library');

module.exports = class MaesterClient extends ApiKeyRestClient {
  constructor(emitter, cfg) {
    super(emitter, cfg);
    this.cfg = cfg;
    this.cfg.resourceServerUrl = process.env.ELASTICIO_OBJECT_STORAGE_URI || cfg.resourceServerUrl;
    this.cfg.apiKeyHeaderName = 'Authorization';
    this.cfg.apiKeyHeaderValue = `Bearer ${(process.env.ELASTICIO_OBJECT_STORAGE_TOKEN || cfg.apiKeyHeaderValue)}`;
    emitter.logger.debug(`resourceServerUrl: ${this.cfg.resourceServerUrl}`);
    emitter.logger.debug(`apiKeyHeaderValue: ${this.cfg.apiKeyHeaderValue}`);
    this.cfg.apiKeyHeaderValue = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IjU2YzIwN2FkYjkxMjExODFlNjUwYzBlZiIsImNvbnRyYWN0SWQiOiI1YzIyMGQ3YTIxMzI0MDAwMTI0YzljYjgiLCJ3b3Jrc3BhY2VJZCI6IjVjMjIwZDdhMjEzMjQwMDAxMjRjOWNiYSIsImZsb3dJZCI6IjVlN2M2ZWM3NDhiZGFmMDAxNGY3MzkyOSIsInVzZXJJZCI6IjVjMjIwZDdhMjEzMjQwMDAxMjRjOWNiNyIsImlhdCI6MTU4NTIxMzEyN30.Jji8SR-W_AEVn1F2_nalcAdO4QzBFTmfNRWAsqZgfqQ';
    this.authRestClient = new ApiKeyRestClient(emitter, cfg);
  }
};
