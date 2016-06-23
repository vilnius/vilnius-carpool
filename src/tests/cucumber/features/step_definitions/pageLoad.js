url = require('url');
var d;

d = console.log.bind(this, "---");

module.exports = function() {
  return this.Given(/^I'm on the page$/, function() {
    client.url(url.resolve(process.env.ROOT_URL, "/m/your/drives"));
  });
};
