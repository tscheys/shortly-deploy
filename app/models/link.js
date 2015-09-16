var crypto = require('crypto');
var mongoose = require('mongoose');

var LinkSchema = new mongoose.Schema({
  visits: 'string',
  url: 'string', 
  title: 'string',
  code: 'string'
});
var Link = mongoose.model('Link', LinkSchema);

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

module.exports = Link;
