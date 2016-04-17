// ==UserScript==
// @name         MessengerPG
// @namespace    http://messengerpg.tech/
// @version      0.3
// @description  PGP encrypt your messages
// @author       Petar Segina, Stanko Krtalic Rusendic, Luka Strizic, Marko Bozac
// @match        https://www.messenger.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

var incomingMessageBubbleClass = "_3oh-";

var outputMessageTransformer = function(input) {
  var mgp = new MPG();

  return mgp.encrypt(input, ['Stanko', 'Petar']);
};

var inputMessageTransformer = function(body) {
  var mgp = new MPG();

  return mgp.decrypt(body);
};

if (!Object.prototype.watch) {
  Object.defineProperty(Object.prototype, "watch", {
      enumerable: false
    , configurable: true
    , writable: false
    , value: function (prop, handler) {
      var
        oldval = this[prop]
      , newval = oldval
      , getter = function () {
        return newval;
      }
      , setter = function (val) {
        oldval = newval;
        return newval = handler.call(this, prop, oldval, val);
      }
      ;

      if (delete this[prop]) { // can't watch constants
        Object.defineProperty(this, prop, {
            get: getter
          , set: setter
          , enumerable: true
          , configurable: true
        });
      }
    }
  });
}

// object.unwatch
if (!Object.prototype.unwatch) {
  Object.defineProperty(Object.prototype, "unwatch", {
      enumerable: false
    , configurable: true
    , writable: false
    , value: function (prop) {
      var val = this[prop];
      delete this[prop]; // remove accessors
      this[prop] = val;
    }
  });
}

//------

console.log("Adding PGP support!");

window.watch("__d", function(id, oldVal, newVal) {
  return function(sa, ta, ua, va) {
    if(sa == "MessengerComposerInput.react") {
      var oldUa = ua;
      var newUa = function(b, c, d, e, f, g, h, i) {

        var oldC = c;
        // Patch the factory function
        c = function(name) {

          var thing = oldC(name);
          var oldClassCreator = thing.createClass;

          // Patch the create class method so we can modify object maps on the fly
          thing.createClass = function(obj) {
            // Replace the getValue property if it is present
            if(obj.displayName === "MessengerInput" && obj.hasOwnProperty("getValue")) {
              if (!(obj._originals && obj._originals.getValue)) {

                obj._originals = {};
                obj._originals.getValue = obj.getValue;
                obj.getValue = function() {

                  return outputMessageTransformer(this._originals.getValue.bind(this)());
                };
              }
            }
            return oldClassCreator(obj);
          };

          // Patch the createElement method so that we can change element renderings on the fly
          if(name === "React") {
            var oldElementCreator = thing.createElement;

            if(oldElementCreator && oldElementCreator.length === 3) {

              thing.createElement = function() {
                if(arguments.length > 1) {

                  var elementArgs = arguments[1];
                  if(elementArgs && elementArgs.hasOwnProperty("className") && elementArgs.className === incomingMessageBubbleClass && elementArgs.body) {

                     elementArgs.body = inputMessageTransformer(elementArgs.body);
                  }
                }

                return oldElementCreator.apply(this, arguments);
              };
            }
          }

          return thing;
        };

        return oldUa(b, c, d, e, f, g, h, i);
      };

      ua = newUa;
    }

    newVal(sa, ta, ua, va);
  };
});

MPG = function() {
  this.message = '';
  this.recipients = [];
  this.url = {
    encrypt: 'https://pgp.messenger.com/encrypt',
    decrypt: 'https://pgp.messenger.com/decrypt'
  };
};

MPG.prototype.encrypt = function(message, recipients) {
  this.message = message;
  this.recipients = recipients;

  var data = {
    message: message,
    recipients: recipients
  };

  return this.ajax(this.url.encrypt, data, 'POST');
};

MPG.prototype.decrypt = function(message) {
  this.message = message;

  var parts = this.extractMessages(message);
  
  if(this.isPgpMessage(message)) {
    return this.ajax(this.url.decrypt, { message: message }, 'POST'); 
  } else {
    return message;
  }
};

MPG.prototype.isPgpMessage = function(message) {
  return message.match(/-----BEGIN\sPGP.*?\sMESSAGE-----(\n|.)*?-----END\sPGP\sMESSAGE-----/);
}

MPG.prototype.extractMessages = function(message) {
  var messages = message.match(/-----BEGIN\sPGP.*?\sMESSAGE-----(\n|.)*?-----END\sPGP\sMESSAGE-----/);

  if (messages && messages.length > 0) {
    return messages;
  }

  return;
};

MPG.prototype.ajax = function(url, body, verb) {
  var request = new XMLHttpRequest();
  request.open(verb, url, false);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify(body));

  if (request.status === 200) {
    var message = '';
    try {
      message = JSON.parse(request.responseText);
      return message.message;
    }
    catch(e) {
      alert(e);
    }
  }
  else {
    alert('No response from server!');
  }

  return null;
};
