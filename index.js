/* jshint node:true */
'use strict';

var Hapi = require('hapi');
var hoodie = require('hoodie');
var url = require('url');
var path = require('path');
var proxy = require('http-proxy-middleware');

var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

var hapiOptions = {
  server: {},
  connection: {
    port: 4201
  }
};
var hoodieOptions = {
  paths: {
    public: 'dist'
  }
};

function hoodieMiddleware(config) {
  config.app.use('/hoodie', proxy({target: 'http://localhost:' + hapiOptions.connection.port}));

  var server = new Hapi.Server(hapiOptions.server);
  server.connection(hapiOptions.connection);

  server.register({
    register: hoodie,
    options: hoodieOptions
  }, function (error) {
    if (error) {
      throw error;
    }

    console.log('app', 'Starting');
    server.start(function (error) {
      if (error) {
        throw error;
      }

      console.log('Your Hoodie server has started on ' + url.format(server.info.uri));
    });
  });
}

module.exports = {
  name: 'ember-hoodie',

  // ember-browserify has the drawback that apps using ember-hoodie would be
  // required to install ember-browserify as well.
  // https://github.com/ef4/ember-browserify#using-ember-browserify-in-addons
  treeForVendor(tree) {
    var hoodiePackage = path.dirname(require.resolve('@hoodie/client'));
    var hoodieTree = new Funnel(this.treeGenerator(hoodiePackage), {
      srcDir: 'dist',
      destDir: '/'
    });
    if (tree) {
      return mergeTrees([tree, hoodieTree]);
    } else {
      return hoodieTree;
    }
  },

  included(app) {
    this._super.apply(this, arguments);

    app.import('vendor/hoodie.js');
  },

  serverMiddleware: hoodieMiddleware
};
