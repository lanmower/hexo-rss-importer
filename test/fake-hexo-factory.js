// Return mock hexo for unit testing.
exports.create = function (config) {
  var mock = {};
  mock.config = config;
  mock.on = function(name, callback){
    return callback();
  };
  mock.setValues =
  {
    registeredType: null,
    receivedPosts: [],
    registeredFunction: null,
    calledType: null
  };
  mock.log = {
    i: function () { },
    w: function () { }
  };
  return mock;
};