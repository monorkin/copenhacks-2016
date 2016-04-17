var gpg = require('gpg')
var graph = require('fbgraph');
var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');

//graph.setAccessToken('1666175160300126|4984c6dab64a59241f4e5f4e3912aec7');
graph.setAccessToken('EAAXrYKKQMl4BAJgyXmccRyJyBMflZAO6XPs4OdNTHTeJAblySQqZA50ObAoKIKVpGbBOyxCZB4i4ne8VT3lrvsVMZBhELzKI8e1Tt8MXSAZBB6b3UAAVIdAkjBqPo5AvxWaCNJDpQMMhQ3R8jJXb4Tk2bZBP9a4lklDZALJJSjSLQZDZD');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

var gotKeys = [];
var gotUsernames = [];
/*
var getKeysFromFbIfNeeded = function(ids){
  for(var i in ids){
    var id = ids[i];
    if(gotKeys.indexOf(id) != -1)
      continue;

    gotKeys.push(id);
    graph.get(id + '?fields=public_key', function(err, res) {
      if(!err && res.public_key){
        console.log('Key:');
        console.log(res.public_key);
        gpg.importKey(res.public_key, [], null);
      }else{
        console.log('Key:');
        console.log(err);
      }
    });
  }
}

var getKeysFromFbIfNeeded = function(usernames){
  for(var i in usernames){
    var username = usernames[i];
    if(gotUsernames.indexOf(username) != -1)
      continue;

    gotUsernames.push(username);

    graph.get('search?q=' + username + '&type=user', function(err, res){
      if(!err && res && res.data && res.data[0] && res.data[0].id){
        var id = res.data[0].id;
        graph.get(id + '?fields=public_key', function(err, res) {
          if(!err && res && res.public_key){
            console.log('Key:');
            console.log(res.public_key);
            gpg.importKey(res.public_key, [], function(){});
          }else{
            console.log('Key:');
            console.log(err);
          }
        });
      }
    });
  }
}
*/

app.post('/encrypt', function (req, res) {
  var args = ['--armor', '--sign'];
  for(var i in req.body.recipients){
    args.push('-r');
    args.push(req.body.recipients[i]);
  }
  //if(req.body.usernames) getKeysFromFbIfNeeded(req.body.usernames);
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
  //if(req.body.usernames) getKeyFromFbIfNeeded(req.body.usernames);
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
