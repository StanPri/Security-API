var cors            = require('cors'),
    https           = require('https'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    bodyParser      = require('body-parser'),
    fs              = require('fs');

var app = express();

var options = {
  key  : fs.readFileSync('./bpasapi_technology_ca_gov.key'),
  cert : fs.readFileSync('./bpasapi_technology_ca_gov_cert.cer')
};

dotenv.config({silent: true});
var environment = process.env.NODE_ENV || 'development';
var port = process.env.NODE_PORT || '3001';

if (environment === 'development') {
  app.use(errorhandler())
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

app.use(require('./tokenRoutes'));
app.use(require('./secureRoutes'));

https.createServer(options, app).listen(port, function (err) {
  console.log('Listening at http://localhost:' + port + ' in ' + environment + ' mode.');
});
