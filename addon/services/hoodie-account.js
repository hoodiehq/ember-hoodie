import Ember from 'ember';
const {
  get,
  inject: {
    service
  }
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
  // isSignedIn: false,
  // username: '',

  init() {
    this._super(...arguments);

    let account = get(this, 'hoodie.account');

    for (let event in eventInvalidations) {
      let props = eventInvalidations[event];
      account.on(event, this._notifyProperties.bind(this, props));
    }
    this.set('account', account);

    let update = () => {
      this._updateAccountProperties();
    };

    this._updateAccountProperties();

    this.get('hoodie.account').on('signin', update);
    this.get('hoodie.account').on('signout', update);
    this.get('hoodie.account').on('unauthenticate', update);
    this.get('hoodie.account').on('reauthenticate', update);
    this.get('hoodie.account').on('update', update);
  },

  _updateAccountProperties: function() {
    this.account.get('session').then(session => {
      let signedIn = session ? true : false;
      this.set('isSignedIn', signedIn);
    });
    this.account.get('username').then(username => {
      this.set('username', username);
    });
    this.account.get('session.invalid').then(hasInvalidSession => {
      this.set('hasInvalidSession', hasInvalidSession);
    });
    this.account.profile.get().then(profile => {
      this.set('profile', profile);
    });
  },

  _hoodieAccount() {
    return get(this, 'hoodie.account');
  },

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
