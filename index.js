/* jshint node:true */
'use strict';

var url = require('url');
var path = require('path');

var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');


function startHoodieServer(app, hoodieConfig) {
  var Hapi = require('hapi');
  var hoodie = require('hoodie');
  var proxy = require('http-proxy-middleware');

  app.use('/hoodie', proxy({ target: 'http://localhost:' + hoodieConfig.server.port }));

  var server = new Hapi.Server();
  server.connection({
    port: hoodieConfig.server.port
  });

  server.register({
    register: hoodie,
    options: hoodieConfig.server
  }, function(error) {
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

  testemMiddleware: function(app) { 
    var appConfig = this.project.config('test');

    if (appConfig.hoodie) {
      startHoodieServer(app, appConfig.hoodie)
    }
  },
  serverMiddleware: function(config) {
    /* jshint -W040 */
    var appConfig = this.project.config(config.options.environment);
    /* jshint +W040 */

    if (appConfig.hoodie) {
      startHoodieServer(config.app, appConfig.hoodie);
    }
  }
};
