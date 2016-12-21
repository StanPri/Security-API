var express = require('express'),
    jwt     = require('express-jwt'),
    config  = require('./config'),
    quoter  = require('./quoter');

var app = module.exports = express.Router();

var jwtCheck = jwt({
  secret: config.secret
});

app.use('/sec', jwtCheck);

app.get('/sec/quote', function(req, res) {
  if (req.user.CN=="User") {
    res.status(200).send(quoter.getRandomOne());
  } else {
  return res.sendStatus(401);
  }
});
