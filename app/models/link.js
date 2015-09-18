var crypto = require('crypto');
var mongoose = require('mongoose');

var LinkSchema = new mongoose.Schema({
  visits: {
    type: 'number',
    default: 0
  },
  url: 'string', 
  title: 'string',
  code: 'string'
});
var Link = mongoose.model('Link', LinkSchema);

module.exports = Link;
