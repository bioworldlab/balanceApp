'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var validateJwt = expressJwt({
    secret: config.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 401
 */
function isAuthenticated() {
  return compose()
  // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      User.findById(req.user._id, function(err, user) {
        if (err) return next(err);
        if (!user) return res.sendStatus(401);

        req.user = user;
        next();
      });
    })
    // Handle Express-JWT error: UnauthorizedError
    .use(function (err, req, res, next) {
      if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
      }
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
    if (!roleRequired) throw new Error('Required role needs to be set');

    return compose()
        .use(isAuthenticated())
        .use(function (req, res, next) {
            if (meetsRoleRequirement(req.user.role, roleRequired)) {
                next();
            } else {
                res.sendStatus(403);
            }
        });
}

function meetsRoleRequirement(role, roleRequired) {
  if (!role) throw new Error('Role needs to be set');
  if (!roleRequired) throw new Error('Required role needs to be set');

  if (config.userRoles.indexOf(role) >= config.userRoles.indexOf(roleRequired)) {
    return true;
  } else {
    return false;
  }
}


/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
    return jwt.sign({
        _id: id
    }, config.secrets.session, {
      expiresIn: "5h"
    });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
    if (!req.user) return res.status(404).json({
        message: 'Something went wrong, please try again.'
    });
    var token = signToken(req.user._id, req.user.role);
    res.cookie('token', JSON.stringify(token));
    res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.meetsRoleRequirement = meetsRoleRequirement;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
