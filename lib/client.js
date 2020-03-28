/* eslint-disable no-param-reassign */

const { ApiKeyRestClient } = require('@elastic.io/component-commons-library');

module.exports = class MaesterClient extends ApiKeyRestClient {
  constructor(emitter, cfg) {
    cfg.resourceServerUrl = process.env.ELASTICIO_OBJECT_STORAGE_URI;
    cfg.apiKeyHeaderName = 'Authorization';
    // cfg.apiKeyHeaderValue = `Bearer ${process.env.ELASTICIO_OBJECT_STORAGE_TOKEN}`;
    cfg.apiKeyHeaderValue = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IjU2YzIwN2FkYjkxMjExODFlNjUwYzBlZiIsImNvbnRyYWN0SWQiOiI1YzIyMGQ3YTIxMzI0MDAwMTI0YzljYjgiLCJ3b3Jrc3BhY2VJZCI6IjVjMjIwZDdhMjEzMjQwMDAxMjRjOWNiYSIsImZsb3dJZCI6IjVlN2ZhODJhYTQ2YjdlMDAxNDEyMGY3ZCIsInVzZXJJZCI6IjVjMjIwZDdhMjEzMjQwMDAxMjRjOWNiNyIsImlhdCI6MTU4NTQyNDQyNn0.R3xkc-QjT3N383xCABl6hnZJhnow7zrm7PM32e1aGwk';
    super(emitter, cfg);
    this.authRestClient = new ApiKeyRestClient(emitter, cfg);
  }
};
