var args = require('system').args
var page = require('webpage').create();
var uuid = require('node-uuid');

var site = args[1];
console.log("Saving site screenshot", site);

page.open(site, function() {
    var filename = uuid.v4();
    var path = "./snapshots/" + filename + ".png"
    page.render(path);
    console.log("Screenshot saved to", path);
    phantom.exit();
});

