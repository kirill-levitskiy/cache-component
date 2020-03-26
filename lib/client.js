const { ApiKeyRestClient } = require('@elastic.io/component-commons-library');
const removeTrailingSlash = require('remove-trailing-slash');
const removeLeadingSlash = require('remove-leading-slash');

module.exports = class MaesterClient extends ApiKeyRestClient {
  constructor(emitter, cfg) {
    super(emitter, cfg);
    this.cfg = cfg;
    this.cfg.resourceServerUrl = process.env.ELASTICIO_OBJECT_STORAGE_URI;
    this.cfg.apiKeyHeaderName = 'Authorization';
    this.cfg.apiKeyHeaderValue = `Bearer: ${process.env.ELASTICIO_OBJECT_STORAGE_TOKEN}`;
    emitter.logger.debug(`resourceServerUrl: ${this.cfg.resourceServerUrl}`);
    emitter.logger.debug(`apiKeyHeaderValue: ${this.cfg.apiKeyHeaderValue}`);
    this.authRestClient = new ApiKeyRestClient(emitter, cfg);
  }

  async makeRequest(options) {
    const {
      url, method, body, headers = {}, urlIsSegment = true, isJson = true,
    } = options;
    const urlToCall = urlIsSegment
      ? `${removeTrailingSlash(this.cfg.resourceServerUrl.trim())}/${removeLeadingSlash(url.trim())}` // Trim trailing or leading '/'
      : url.trim();

    this.emitter.logger.trace(`Making ${method} request to ${urlToCall} with body: %j ...`, body);

    const requestOptions = {
      method,
      body,
      headers,
      url: urlToCall,
      json: isJson,
    };

    this.emitter.logger.info(`Request Options ${JSON.stringify(requestOptions)}`);

    // eslint-disable-next-line no-underscore-dangle
    await this.addAuthenticationToRequestOptions(requestOptions);

    const response = await this.request(requestOptions);

    return this.handleRestResponse(response);
  }
};
