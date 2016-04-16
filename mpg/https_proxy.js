var fs = require('fs');
var httpProxy = require('http-proxy');

var options = {
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.crt')
};

httpProxy.createServer({
  target: {
    host: '127.0.0.1',
    port: 3000 
  },
  ssl: options
}).listen(443);
