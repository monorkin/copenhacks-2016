var gpg = require('gpg')
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/encrypt', function (req, res) {
  gpg.encrypt('Bok Luka', ['--armor', '--sign', '-r', 'luka.strizic@hotmail.com'], function(err, data){
    console.log(err);
    res.send(data);
  });
});

app.post('/decrypt', function (req, res) {
  gpg.decrypt(req.body.message, [], function(err, contents){
    console.log(err);
    res.send(contents);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
