var gpg = require('gpg')
var graph = require('fbgraph');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

graph.setAccessToken('1666175160300126|4984c6dab64a59241f4e5f4e3912aec7');
//graph.setAccessToken('EAAXrYKKQMl4BAGm85QSJM2y3VZCdsRpVOfgWPPynsZA5kcuxyr8EndZBm1ZCc1qckshiDZA1Y8cWLSAV3ZCGovMN0VkvGbcOTvrwdcrJxzVjyVpWKsq3dV3i7NiDgBhWjLUDfxEVEMPyOaKW3ZAT68WlT1XYHdW0tq2LElnSzoqUwZDZD');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var gotKeys = [];

var getKeysFromFbIfNeeded = function(ids){
  for(var i in ids){
    var id = ids[i];
    if(gotKeys.indexOf(id))
      continue;

    gotKeys.push(id);
    graph.get(id + '?fields=public_key', function(err, res) {
      if(!err){
        console.log('Key:');
        console.log(res);
        gpg.importKey(res, [], null);
      }else{
        console.log('Key:');
        console.log(err);
      }
    });
  }
}

app.post('/encrypt', function (req, res) {
  var args = ['--armor', '--sign'];
  for(var i in req.body.recipients){
    args.push('-r');
    args.push(req.body.recipients[i]);
  }
  if(req.body.ids) getKeysFromFbIfNeeded(req.body.ids);
  gpg.encrypt(req.body.message, args, function(err, data){
    if(err){
      console.log(err);
      res.send(JSON.stringify({"message":req.body.message, "error":err}));
    }else{
      res.send(JSON.stringify({"message":data.toString(), "error":err}));
    }
  });
});

app.post('/decrypt', function (req, res) {
  if(req.body.ids) getKeyFromFbIfNeeded(req.body.ids);
  gpg.decrypt(req.body.message, [], function(err, contents){
    if(err){
      res.send(JSON.stringify({"message":req.body.message, "error":err}));
      console.log(err);
    }else{
      res.send(JSON.stringify({"message":contents.toString(), "error":err}));
    }
  });
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
