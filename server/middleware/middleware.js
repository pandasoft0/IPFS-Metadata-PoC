const bodyParser = require('body-parser');

// Cors Middleware
function corsMiddleware(app) {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json());
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'POST, GET, HEAD, OPTIONS');
    next();
  });
}

module.exports = {
  corsMiddleware    : function(app) {corsMiddleware(app)},
}
