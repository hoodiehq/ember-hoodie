/* jshint node:true */
'use strict';


var url = require('url');
var path = require('path');


var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

function hoodieMiddleware(config) {
  /* jshint -W040 */
  var appConfig = this.project.config(config.options.environment);
  /* jshint +W040 */

  if (!appConfig.hoodie) {
    return;
  }

  var Hapi = require('hapi');
  var hoodie = require('hoodie').register;
  var proxy = require('http-proxy-middleware');
  var PouchDB = require('pouchdb');

  config.app.use('/hoodie', proxy({target: 'http://localhost:' + appConfig.hoodie.server.port}));

  var server = new Hapi.Server();
  server.connection({
    host: 'localhost',
    port: appConfig.hoodie.server.port
  });

  server.register({
    register: hoodie,
    options: {
      PouchDB: PouchDB,
      // paths: {
      //   data: '.hoodie'
      // },
      adminPassword: appConfig.hoodie.server.adminPassword,
      client: {
        url: "http://localhost:"+ appConfig.hoodie.server.port
      }
    }
    // options: appConfig.hoodie.server
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
    var pouchdbPackage = path.join(path.dirname(require.resolve('pouchdb')), '..', 'dist');
    var pouchdbTree = new Funnel(pouchdbPackage, {
      files: ['pouchdb.js'],
      destDir: 'pouchdb'
    });
    if (tree) {
      return mergeTrees([tree, hoodieTree, pouchdbTree], {overwrite: true});
    } else {
      return hoodieTree;
    }
  },

  included(app) {
    this._super.apply(this, arguments);

    app.import('vendor/hoodie.js');
    app.import('vendor/pouchdb/pouchdb.js');
  },

  serverMiddleware: hoodieMiddleware
};
