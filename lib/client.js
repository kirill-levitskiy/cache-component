/* eslint-disable no-param-reassign */

const { ApiKeyRestClient } = require('@elastic.io/component-commons-library');

module.exports = class MaesterClient extends ApiKeyRestClient {
  constructor(emitter, cfg) {
    cfg.resourceServerUrl = process.env.ELASTICIO_OBJECT_STORAGE_URI;
    cfg.apiKeyHeaderName = 'Authorization';
    // cfg.apiKeyHeaderValue = `Bearer ${process.env.ELASTICIO_OBJECT_STORAGE_TOKEN}`;
    cfg.apiKeyHeaderValue = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IjU2YzIwN2FkYjkxMjExODFlNjUwYzBlZiIsImNvbnRyYWN0SWQiOiI1YzIyMGQ3YTIxMzI0MDAwMTI0YzljYjgiLCJ3b3Jrc3BhY2VJZCI6IjVjMjIwZDdhMjEzMjQwMDAxMjRjOWNiYSIsImZsb3dJZCI6IjVlN2ZjNDVmYTQ2YjdlMDAxNDE0Mzg2ZiIsInVzZXJJZCI6IjVjMjIwZDdhMjEzMjQwMDAxMjRjOWNiNyIsImlhdCI6MTU4NTQzMTY0N30.S34h27R7a3lK2t1Fqm1C_xRyHBJi08nzktUtIp14qig';
    super(emitter, cfg);
    this.authRestClient = new ApiKeyRestClient(emitter, cfg);
  }
};
