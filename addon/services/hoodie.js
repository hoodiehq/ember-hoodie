import Ember from 'ember';

const {
  Service,
  get,
  set
} = Ember;

export default Service.extend({
  init() {
    console.log("called");
    this._super(...arguments);
    let hoodie = new Hoodie();
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
