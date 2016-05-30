/*jshint node:true*/

// thanks to @rwjblue
// https://github.com/rwjblue/ember-cli-divshot/blob/55f63e540f237357676a1c7d93c84804ac106abc/blueprints/divshot/index.js

module.exports = {
  description: 'default blueprint to update .gitignore',

  normalizeEntityName: function() {
    // this prevents an error when the entityName is not
    // specified (since that doesn't actually matter to us)
  },

  afterInstall: function() {
    return this.insertIntoFile('.gitignore', '\n# added by ember-hoodie\n.hoodie');
  }
};
