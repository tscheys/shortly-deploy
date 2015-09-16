var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var User = require('../app/models/user');
var Link = require('../app/models/link');
var mongoose = require('mongoose');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(200, links);
    }
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  console.log("got the request!")

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
  Link.findOne({url: uri}, function(err, link) {
    console.log("DOC IS");
    console.log(link);
    if(link) {
      res.send(200, link);
    }
    else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var shasum = crypto.createHash('sha1');
        shasum.update(uri);
        var code = shasum.digest('hex').slice(0, 5);
        var link = new Link({
          url: uri,
          title: title,
          base_url: req.header.origin,
          code: code
        });
        link.save(function(err) {
          if (err) {
            console.log("ERROR")
          }
          else {
            console.log("SUCCESS!");
            res.send(200, link);
          }
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function(err, user) {
    if(user) {
      bcrypt.compare(password, user.hash, function(err, result) {
        if(result) {
          req.session.username = username;
          res.redirect('/');
        }
        else {
          res.redirect('/login');
        }
      });
    }
    else {
      res.redirect('/signup');
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function(err, user) {
    if(user) {
      res.redirect('/login');
    }
    else {
      bcrypt.hash(password, null, null, function(err, hash) {
        var user = new User({
          username: username,
          hash: hash
        });
        user.save(function(err) {
          if (err) {
            console.log("Can't do it!");
            res.redirect('/signup');
          }
          else {
            console.log("I did it!");
            req.session.username = username;
            res.redirect('/');
          }
        })
      });
    }
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({code: req.params[0]}, function(err, link) {
    if (!link) {
      res.redirect('/');
    }
    else {
      // link.update()
      Link.update({code: req.params[0]}, {$inc : {visits : 1}}, {}, function(err) {
        if (err) {
          console.log(err);
          console.log("failed to increment visit count")
        }
        else {
          console.log("incrementing visit count")
        }
      });
      res.redirect(link.url);
    }
  });
};