import DS from 'ember-data';
import Ember from 'ember';

const {
  get,
  inject: {
    service
  },
  String: {
    camelize
  }
} = Ember;

export default DS.Adapter.extend({
  hoodie: service(),

  init() {
    this._super(...arguments);
    this._queue = Ember.RSVP.resolve();
  },

  findRecord(store, type, id) {
    return this._next(() => {
      return this._hoodieStore().find(id);
    });
  },

  createRecord(store, type, snapshot) {
    var props = this.serialize(snapshot);
    if (snapshot.id) {
      props.id = snapshot.id;
    }
    props.type = camelize(type.modelName);
    return this._next(() => {
      return this._hoodieStore().add(props);
    });
  },

  updateRecord(store, type, snapshot) {
    var props = this.serialize(snapshot);
    return this._next(() => {
      return this._hoodieStore().update(snapshot.id, props);
    });
  },

  // because hoodie/pouchdb uses UUIDs, we don't actually need
  // a scoped store for the delete.
  // Also, scoped remove is a little buggy
  // https://github.com/hoodiehq/hoodie-store-client/issues/95
  deleteRecord(store, type, snapshot) {
    return this._next(() => {
      return this._hoodieStore().remove(snapshot.id);
    });
  },

  findAll(store, type) {
    return this._next(() => {
      let isOfType = function(m){
        return m.type === type.modelName;
      };
      return this._hoodieStore().findAll(isOfType);
    });
  },

  query() {
    throw new Error('not implemented');
  },

  _hoodieStore() {
    return get(this, 'hoodie.store');
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
