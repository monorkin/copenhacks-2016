// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.messenger.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

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
  console.log("__d set to " + newVal.toString() + " | " + id);
  window.unwatch("__d");
  return function(sa, ta, ua, va) {
    if(sa == 'MessengerComposerInput.react') {
      console.log("__d sa=" + sa + "\nta=" + ta + "\nua=" + ua + "\nva=" + va);
      var oldUa = ua;
      var newUa = function(b, c, d, e, f, g, h, i) {
        var oldC = c;
        // Patch the factory function
        c = function(name) {
          var thing = oldC(name);
          var oldCreator = thing.createClass;
          // Patch the create class method so we can modify object maps on the fly
          thing.createClass = function(obj) {
            // Replace the getValue property if it is present
            if(obj['displayName'] === "MessengerInput" && obj.hasOwnProperty('getValue')) {
              var oldGetter = obj.getValue;
              obj.getValue = function() {
                console.log("calling getValue()");
                console.log(oldGetter);
                debugger
                return "oldGetter().toUpperCase()";
              };
            }
            return oldCreator(obj);
          };
          return thing;
        };
        return oldUa(b, c, d, e, f, g, h, i);
      };
      ua = newUa;
    }
    newVal(sa, ta, ua, va);
  };
});
