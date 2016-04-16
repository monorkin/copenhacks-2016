var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;

pageMod.PageMod({
  include: "https://www.messenger.com/*",
  contentScriptFile: data.url("messenger.js")
});
