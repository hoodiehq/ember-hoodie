import Ember from 'ember';

const {
  Service,
  get,
  set
} = Ember;

export default Service.extend({
  init() {
    this._super(...arguments);
    let config = Ember.getOwner(this).application.resolveRegistration('config:environment').hoodie.client
    let hoodie = new Hoodie(config);
    set(this, 'hoodie', hoodie);
    // for debug only
    window.hoodie = hoodie;
  },

  unknownProperty(keyName) {
    let hoodie = get(this, 'hoodie');
    if (keyName in hoodie) {
      return hoodie[keyName];
    } else {
      this._super(...arguments);
    }
  }
});
