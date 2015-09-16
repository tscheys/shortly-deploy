var app = require('./server-config.js');
var mongoose = require('mongoose');

var port = null;
var mongoUrl = null;
if (process.env.NODE_ENV === 'production') {
  port = 80;
  mongoUrl = 'mongodb://theBuffetDB:XAbbOqi7mdlEs4oagW6taZLFB6ADVccJcq.UoK.yQaE-@ds040888.mongolab.com:40888/theBuffetDB'
  url = "0.0.0.0"
}
else {
  port = 4568
  mongoUrl = 'mongodb://localhost/shortly'
  url = "127.0.0.1"
}

mongoose.connect(mongoUrl);

app.listen(port, url);

console.log('Server now listening on port ' + port);
