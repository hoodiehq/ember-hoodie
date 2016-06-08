# Ember-hoodie

This addon lets you use the awesome [hoodie](http://hood.ie) project
seamlessly with Ember.js

## Installing

* `npm install -S ember-hoodie`

## Usage

```js
// app/application/controller.js
import Ember from 'ember';
const {
  Controller,
  inject: { service }
} = Ember;

export default Controller.extend({
  hoodieAccount: service('hoodie-account'),

  actions: {
    signIn(username, password) {
      this.get('hoodieAccount').signIn({username, password});
    },

    signOut() {
      this.get('hoodieAccount').signOut();
    }
  }
});
```

```js
// app/services/store.js
import HoodieStore from 'ember-hoodie/services/store';

export default HoodieStore;
```

Now, you can just use the store as you are used to! Whabam! Please help
me fill out these docs a little better.

## Hacking locally

* `git clone` this repository
* `npm install`
* `bower install`
