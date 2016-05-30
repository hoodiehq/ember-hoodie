/* jshint node:true */
'use strict';

var getHoodieServer = require('hoodie');
var url = require('url');
var proxy = require('http-proxy-middleware');

var hoodie_options = {
  port: 4201
}

module.exports = {
  name: 'ember-hoodie',

  included(app) {
    this._super(...arguments);

    app.import('vendor/hoodie.js');
  },

  serverMiddleware(config) {
    config.app.use('/hoodie', proxy({target: 'http://localhost:' + hoodie_options.port}));

    getHoodieServer(hoodie_options, function (error, server, config) {
      if (error) {
        var stack = new Error().stack.split('\n').slice(2).join('\n')
        return console.log('app', 'Failed to initialise:\n' + stack, error)
      }

      console.log('app', 'Starting')

      server.start(function () {
        console.log('Your Hoodie server has started on ' + url.format(config.connection))
      })
    })
  }
};
