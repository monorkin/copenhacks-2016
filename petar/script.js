// ==UserScript==
// @name        Messenger+PGP
// @namespace   psegina.com
// @description Adds PGP support to Messenger.com
// @include     https://www.messenger.com/*
// @version     1
// @grant       none
// @run-at      document-start
// ==/UserScript==


console.log("Adding PGP support!")

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
              var oldGetter = obj['getValue'];
              obj.getValue = function() {
                console.log("calling getValue()")
                console.log(oldGetter);
                return "oldGetter().toUpperCase()";
              }
            }
            
            return oldCreator(obj);
          }
          return thing;
        }
        /*
        f.watch("exports", function(id, oldVal, newVal) {
          console.log("Export changed to " + newVal);
          console.log(newVal);
          debugger;
          console.log(this);
          window.extComp = newVal;
          return newVal;
        }) 
        console.log("Called new ua! " + f);
        */
        return oldUa(b, c, d, e, f, g, h, i);
      }
      ua = newUa;
    }
    newVal(sa, ta, ua, va);
  }
});
