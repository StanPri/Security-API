var express   = require('express'),
    _         = require('lodash'),
    config    = require('./config'),
    jwt       = require('jsonwebtoken');
    nodeSSPI  = require('node-sspi');
    rolesDB    = require('./rolesDB');

var app = module.exports = express.Router();

// Creates a JWT token with the provided claims in the payload.
function createToken(claims) {
  return jwt.sign(claims, config.secret, { expiresIn: '1h' });
}

app.get('/createToken', function (req, res, next) {
  // Uses node-sspi to authenticate the user via NTLM (Windows authentication).
  // Returns a list of AD groups the user belongs to in req.connection.userGroups.
  var nodeSSPIObj = new nodeSSPI({
    retrieveGroups: true
  });
  nodeSSPIObj.authenticate(req, res, function(err) {
    res.finished || next();
  });
}, function (req, res) {
  var userGroups = req.connection.userGroups;
  var user = { "sub": req.connection.user };
  var userClaims = {};
  // Add user name to the claims variable.
  _.assign(userClaims, user);
  // For each claim defined in rolesDC, checks if the user is in the group and
  // creates a claims if they are.
  Object.keys(rolesDB).forEach(function(role) {
    if (_.includes(userGroups, role)) {
      Object.keys(rolesDB[role]).forEach(function(key) {
        if (!userClaims[key]) {
          userClaims[key] = [];
        }
        userClaims[key].push(rolesDB[role][key]);
      });
    }
  });
  // Sends the JWT to the user as id_token in the body of the response.
  res.status(201).send({ id_token: createToken(userClaims) });
});
