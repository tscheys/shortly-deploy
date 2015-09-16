var app = require('./server-config.js');
var mongoose = require('mongoose');

var port = null;
var mongoUrl = null;
port = process.env.PORT || 4568;
if (process.env.NODE_ENV === 'production') {
  mongoUrl = 'mongodb://theBuffetDB:XAbbOqi7mdlEs4oagW6taZLFB6ADVccJcq.UoK.yQaE-@ds040888.mongolab.com:40888/theBuffetDB'
}
else {
  mongoUrl = 'mongodb://localhost/shortly'
}

mongoose.connect(mongoUrl);

app.listen(port);

console.log('Server now listening on port ' + port);
