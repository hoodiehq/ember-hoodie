/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-hoodie',

  included(app) {
    this._super(...arguments);

    app.import('vendor/hoodie.js');
  }
};
