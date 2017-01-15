var loopback = require('loopback');
var boot = require('loopback-boot');

var http = require('http');
var https = require('https');
var sslConfig = require('./ssl-config');

var app = module.exports = loopback();

app.start = function(httpOnly) {

  if (httpOnly === undefined) {
    var isHTTP = process.env.HTTP;
    if (isHTTP === 'true'){
      httpOnly = true;
    }else{
      httpOnly = false;
    }
  }

  console.log('httpOnly = ' + httpOnly);

  var server = null;

  if (!httpOnly) {
    console.log('starting https server');
    var options = {
      key: sslConfig.privateKey,
      cert: sslConfig.certificate,
      ca: sslConfig.ca
    };
    server = https.createServer(options, app);
  } else {
    console.log ('starting http server');
    server = http.createServer(app);
  }

  // start the web server
  server.listen(app.get('port'), function() {
    app.emit('started');
    //var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('httpOnly = ' + httpOnly);
    var baseUrl = (httpOnly ? 'http://' : 'https://') + app.get('host') + ':' + app.get('port');
    console.log('baseUrl = ' + baseUrl);
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });

  return server;
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
