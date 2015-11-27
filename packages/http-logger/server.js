Log = new Meteor.Collection("log");

Router.map(function () {
  this.route('httpLog', {
    where: 'server',
    path: '/httpLog',

    action: function () {
      var msg = this.request.body;
      msg.st = new Date();
      _.extend(msg, this.request.headers);
      //da(['http-log'], "Log:", msg)
      Log.insert(msg);
      this.response.writeHead(200, {'Content-Type': 'text/html'});
      this.response.end('Logged');
    }
  });
});