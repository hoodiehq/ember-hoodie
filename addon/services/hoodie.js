/* globals Hoodie */
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
    const hoodieConfig = appConfig.hoodie ? appConfig.hoodie.client : {};
    const hoodie = new Hoodie(hoodieConfig);
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
