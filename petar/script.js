console.log("Adding PGP support!")

window.watch("__d", function(id, oldVal, newVal) {
  console.log("__d set to " + newVal.toString() + " | " + id);
  return function(sa, ta, ua, va) {
    if(sa == 'MessengerComposerInput.react') {
     console.log("__d sa=" + sa + "\nta=" + ta + "\nua=" + ua + "\nva=" + va); 
    }
    newVal(sa, ta, ua, va);
  }
});
