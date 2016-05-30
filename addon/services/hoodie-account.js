import Ember from 'ember';

const {
  computed,
  get,
  inject: { service }
} = Ember;

// I kinda just guessed at these...
// There may be unneccessary invalidations,
// or I may have missed some.
const eventInvalidations = {
  'signup': [],
  'signin': ['isSignedIn', 'username'],
  'signout': ['isSignedIn', 'username'],
  'passwordreset': [],
  'unauthenticate': ['isSignedIn', 'username'],
  'reauthenticate': ['isSignedIn', 'username'],
  'update': ['username']
};

const proxiedFunctions = [
  'signUp',
  'signIn',
  'signOut',
  'destroy'
];

export default Ember.Service.extend({
  hoodie: service(),

  init() {
    this._super(...arguments);

    let account = get(this, 'hoodie.account');

    for (let event in eventInvalidations) {
      let props = eventInvalidations[event];
      account.on(event, this._notifyProperties.bind(this, props));
    }
  },

  isSignedIn: computed(function() {
    return get(this, 'hoodie.account').isSignedIn();
  }),

  username: computed(function() {
    return get(this, 'hoodie.account.username');
  }),

  _notifyProperties(props) {
    props.forEach((prop) => {
      this.notifyPropertyChange(prop);
    });
  },

  unknownProperty(key) {
    if (proxiedFunctions.indexOf(key) !== -1) {
      return this.get('hoodie.account')[key];
    }
  }
});
