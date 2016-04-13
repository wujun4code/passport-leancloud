var av = require('leanengine');

function lookup(obj, field) {
  if (!obj) {
    return null;
  }

  if (typeof(obj) === 'object') {
    for (var prop in obj) {
      if (typeof(obj[prop]) === 'object') {
        return lookup(obj[prop], field);
      }
    }
  }

  var chain = field.split(']').join('').split('[');
  for (var i = 0, len = chain.length; i < len; i++) {
    var prop = obj[chain[i]];
    if (typeof(prop) === 'undefined') {
      return null;
    }
    if (typeof(prop) !== 'object') {
      return prop;
    }
    obj = prop;
  }

  return null;
}

function Strategy(o) {
  var opts = o || {};
  var self = this;

  self._usernameField = opts.usernameField || 'username';
  self._passwordField = opts.passwordField || 'password';

  var appId = opts.appId || process.env['LC_APP_ID'] || "";
  var appKey = opts.appKey || process.env['LC_APP_KEY'] || "";
  //var masterKey = opts.masterKey || process.env['MASTER_KEY'] || "";

  if (opts.AV) {
    self.AV = opts.AV;
  } else {
    self.AV = av;
  }
  self.AV.initialize(appId, appKey);

  if (opts.avUser) {
    self.avUser = opts.avUser;
  } else {
    self.avUser = new self.AV.User();
  }

  self.serializeUser = function(user, done) {
    done(null, user);
  };

  self.deserializeUser = function(user, done) {
    done(null, user);
  };

  this.name = "leancloud";

  return this;
}

Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var self = this;

  var username = lookup(req.body, this._usernameField) || lookup(req.query,
    this._usernameField);
  var password = lookup(req.body, this._passwordField) || lookup(req.query,
    this._passwordField);
  var data = {
    username: username,
    password: password
  };

  if (!username || !password) {
    return self.fail({
      message: options.badRequestMessage || 'Missing credentials'
    }, 400);
  }

  self.AV.User.logIn(username, password).then(function(user) {
    // 成功之后回调
    return self.success(user);
  }, function(error) {
    // 失败了
    return self.fail({
      message: error.message,
      code: error.code
    }, 400);
  });
};

module.exports = Strategy;
