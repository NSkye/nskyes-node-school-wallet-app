'use strict';

class ApplicationError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
  get status () {
    return this.statusCode;
  }
};

module.exports = ApplicationError;
