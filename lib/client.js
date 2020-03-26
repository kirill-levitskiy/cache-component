/* eslint-disable no-param-reassign */

const { ApiKeyRestClient } = require('@elastic.io/component-commons-library');
const removeTrailingSlash = require('remove-trailing-slash');
const removeLeadingSlash = require('remove-leading-slash');

module.exports = class MaesterClient extends ApiKeyRestClient {
  constructor(emitter, cfg) {
    cfg.resourceServerUrl = process.env.ELASTICIO_OBJECT_STORAGE_URI;
    cfg.apiKeyHeaderName = 'Authorization';
    cfg.apiKeyHeaderValue = `Bearer: ${process.env.ELASTICIO_OBJECT_STORAGE_TOKEN}`;
    super(emitter, cfg);
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

    // eslint-disable-next-line no-underscore-dangle
    await this.addAuthenticationToRequestOptions(requestOptions);

    this.emitter.logger.info(`Request Options ${JSON.stringify(requestOptions)}`);

    const response = await this.request(requestOptions);

    return this.handleRestResponse(response);
  }
};
