# ember-hoodie

> Use hoodie seamlessly with Ember.js

[![Build Status](https://travis-ci.org/hoodiehq/ember-hoodie.svg?branch=master)](https://travis-ci.org/hoodiehq/ember-hoodie)
[![Dependency Status](https://david-dm.org/hoodiehq/ember-hoodie.svg)](https://david-dm.org/hoodiehq/ember-hoodie)
[![devDependency Status](https://david-dm.org/hoodiehq/ember-hoodie/dev-status.svg)](https://david-dm.org/hoodiehq/ember-hoodie#info=devDependencies)

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
and in your application serializer
```js
// app/serializers/application.js
import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  shouldSerializeHasMany: function() {
    return true;
  },
  primaryKey: '_id' //hoodie generates _id
});
```

```js
// app/services/store.js
import HoodieStore from 'ember-hoodie/services/store';

export default HoodieStore;
```

If you want `ember server` to start the Hoodie Server for you, you have to configure
`ENV.hoodie.server`.

```js
// config/environment.js
if (environment === 'development') {
  ENV.hoodie = {
    client: {
      url: 'http://localhost:4201'
    },
    server: { // https://github.com/hoodiehq/hoodie#hapi-plugin
      adminPassword: 'secret',
      port: 4201
    }
  }
}
```

Now, you can just use the store as you are used to! Whabam! Please help
me fill out these docs a little better.

## Hacking locally

* `git clone` this repository
* `npm install`
* `bower install`
