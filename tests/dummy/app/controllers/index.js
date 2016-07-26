import Ember from 'ember';

export default Ember.Controller.extend({
  account: Ember.inject.service('hoodie-account'),
  showSignIn: true,
  actions: {
    add(title) {
      this.get('store').createRecord('todo', {
        title: title
      }).save();
      this.set('title', '');
    },
    signIn(username, password) {
      this.get('account.signIn')({username, password});
    },
    signUp(username, password) {
      var self = this;
      var signUp = this.get('account.signUp');
      var signIn = this.get('account.signIn');
      signUp({username, password})

      .then(function () {
        return signIn({username, password});
      })

      .then(function () {
        self.send('toggleForm');
      });
    },
    signOut() {
      this.get('account.signOut')();
    },
    toggleForm() {
      this.set('showSignIn', !this.get('showSignIn'));
    }
  }
});
