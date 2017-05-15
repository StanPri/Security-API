var cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    bodyParser      = require('body-parser'),
    fs              = require('file-system');

var app = express();

dotenv.config({silent: true});
var environment = process.env.NODE_ENV || 'development';
var port = process.env.PORT || '3001';

if (environment === 'development') {
  app.use(errorhandler())
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var corsOptions = {
  credentials: true,
  origin: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

app.use(require('./tokenRoutes'));

http.createServer(app).listen(port, function (err) {
  console.log('Listening at http://localhost:' + port + ' in ' + environment + ' mode.');
});
