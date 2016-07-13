import DS from 'ember-data';
import Ember from 'ember';

const {
  inject: { service }
} = Ember;

export default DS.Adapter.extend({
  hoodie: service(),

  init() {
    this._super(...arguments);
    this._queue = Ember.RSVP.resolve();
  },

  findRecord(store, type, id) {
    return this._next(() => {
      return this._storeForType(type).find(id);
    });
  },

  createRecord(store, type, snapshot) {
    var props = this.serialize(snapshot);
    return this._next(() => {
      return this._storeForType(type).add(props);
    });
  },

  updateRecord(store, type, snapshot) {
    var props = this.serialize(snapshot);
    return this._next(() => {
      return this._storeForType(type).update(snapshot.id, props);
    });
  },

  // because hoodie/pouchdb uses UUIDs, we don't actually need
  // a scoped store for the delete.
  // Also, scoped remove is a little buggy
  // https://github.com/hoodiehq/hoodie-store-client/issues/95
  deleteRecord(store, type, snapshot) {
    return this._next(() => {
      return this.get('hoodie.store').remove(snapshot.id);
    });
  },

  findAll(store, type) {
    return this._next(() => {
      return this._storeForType(type).findAll();
    });
  },

  query() {
    throw new Error('not implemented');
  },

  _storeForType(type) {
    return this.get('hoodie.store')(type.modelName);
  },

  // This is used to synchronize and single-file hoodie operations.
  // It helps in situations like:
  // When creating a record. If you find that record with findAll before
  // the create promise resolves, you end up two records in the store for
  // the same hoodie model. They have the same type, id, and attributes,
  // there are just two of them in the store
  //
  // This shouldn't be too bad of a workaround, as these operations are actually very quick.
  // They're not doing server round trips, they're only talking to an in-memory
  // pouchdb store.
  //
  // https://github.com/emberjs/data/issues/4262
  _next(f) {
    return this._queue = this._queue.catch(function(){}).then(f);
  }
});
