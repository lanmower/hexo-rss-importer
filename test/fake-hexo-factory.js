'use strict';

// Return mock hexo for unit testing.
exports.create = function(config) {
  let mock = {};
  let readyCallback;
  mock.config = config;
  mock.callbacks = {};

  mock.on = function(name, callback) {
    this.callbacks[name] = callback;
  };

  mock.triggerOn = function(eventName) {
    let test = this.callbacks[eventName]();
    if (readyCallback) {
      readyCallback();
    }

    return test;
  };

  mock.isReady = function(cb) {
    readyCallback = cb;
  };

  mock.setValues =
  {
    registeredType: null,
    receivedPosts: [],
    registeredFunction: null,
    calledType: null
  };

  mock.log = {
    i: function() {
      // Stub
    },

    w: function() {
      // Stub
    }
  };

  return mock;
};
