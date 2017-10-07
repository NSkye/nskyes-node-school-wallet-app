'use strict';

class ApplicationError extends Error {
  constructor(message, status) {
    super(message);
    this.Status = status;
  }
  get status () {
    return this.Status;
  }
};

module.exports = ApplicationError;
