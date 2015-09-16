var app = require('./server-config.js');
var mongoose = require('mongoose');

var port = null;
var mongoUrl = null;
if (process.env.NODE_ENV === 'production') {
  port = 80;
  mongoUrl = 'mongodb://theBuffetDB:XAbbOqi7mdlEs4oagW6taZLFB6ADVccJcq.UoK.yQaE-@ds040888.mongolab.com:40888/theBuffetDB'
}
else {
  port = 4568
  mongoUrl = 'mongodb://localhost/shortly'
}

mongoose.connect(mongoUrl);

app.listen(port);

console.log('Server now listening on port ' + port);
