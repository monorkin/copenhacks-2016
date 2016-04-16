console.log("Adding PGP support!")

window.watch("__d", function(id, oldVal, newVal) {
  //console.log("__d set to " + newVal.toString() + " | " + id);
  return function(sa, ta, ua, va) {
    if(sa == 'MessengerComposerInput.react') {
      //console.log("__d sa=" + sa + "\nta=" + ta + "\nua=" + ua + "\nva=" + va);
      var oldUa = ua;
      var newUa = function(b, c, d, e, f, g, h, i) {
        f.watch("exports", function(id, oldVal, newVal) {
          console.log("Export changed to " + newVal)
        }) 
        //console.log("Called new ua! " + f);
        return oldUa(b, c, d, e, f, g, h, i);
      }
      ua = newUa;
    }
    newVal(sa, ta, ua, va);
  }
});
