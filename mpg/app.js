var gpg = require('gpg')
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/encrypt', function (req, res) {
  var args = ['--armor', '--sign'];
  for(var i in req.body.recipients){
    args.push('-r');
    args.push(req.body.recipients[i]);
  }
  gpg.encrypt(req.body.message, args, function(err, data){
    console.log(err);
    res.send(JSON.stringify({"message":data.toString(), "error":err}));
  });
});

app.post('/decrypt', function (req, res) {
  gpg.decrypt(req.body.message, [], function(err, contents){
    console.log(err);
    res.send(JSON.stringify({"message":contents.toString(), "error":err}));
  });
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
