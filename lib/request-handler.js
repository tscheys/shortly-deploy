var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');

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
  Link.findOne = Promise.promisify(Link.findOne);
  Link.findOne({url: uri})
  .then(function(link) {
    console.log("DOC IS");
    console.log(link);
    if(link) {
      res.send(200, link);
    }
    else {
      util.getUrlTitle = Promise.promisify(util.getUrlTitle);
      util.getUrlTitle(uri)
      .then(function(title) {
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
      })
      .catch(function(err) {
        console.log(err);
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne = Promise.promisify(User.findOne);
  User.findOne({username: username})
  .then(function(user) {
    if(user) {
      bcrypt.compare = Promise.promisify(bcrypt.compare);
      return bcrypt.compare(password, user.hash)
    }
    else {
      res.redirect('/signup');
      return;
    }
  })
  .then(function(result) {
    console.log("SHOULD HAVE STOPPED BY NOW");
    if(result) {
      req.session.username = username;
      res.redirect('/');
    }
    else {
      res.redirect('/login');
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne = Promise.promisify(User.findOne);

  User.findOne({username: username})
  .then(function(user) {
    if(user) {
      res.redirect('/login');
    }
    else {
      bcrypt.hash = Promise.promisify(bcrypt.hash);
      return bcrypt.hash(password, null, null)
    }
  })
  .then(function(hash) {
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