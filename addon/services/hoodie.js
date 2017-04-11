/* globals Hoodie, PouchDB */
import Ember from 'ember';
const {
  Service,
  get,
  set
} = Ember;

export default Service.extend({
  init() {
    this._super(...arguments);
    const appConfig = Ember.getOwner(this).application.resolveRegistration('config:environment');
    const hoodie = new Hoodie({
      url : appConfig.hoodie.client.url,
      PouchDB : PouchDB
    });
    set(this, 'hoodie', hoodie);
    // for debug only
    window.hoodie = hoodie;
  },

  unknownProperty(keyName) {
    const hoodie = get(this, 'hoodie');
    if (keyName in hoodie) {
      return hoodie[keyName];
    } else {
      this._super(...arguments);
    }
  }
});
