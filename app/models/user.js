var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({username: 'string', hash: 'string'});
var User = mongoose.model('User', UserSchema);

module.exports = User;
