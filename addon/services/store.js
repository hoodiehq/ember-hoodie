import DS from 'ember-data';
import Ember from 'ember';

const {
  get,
  inject: { service }
} = Ember;

export default DS.Store.extend({
  hoodie: service(),
  adapter: 'hoodie',

  init() {
    this._super(...arguments);

    let update = (obj) => {
      let type = obj.type;
      let data = this.normalize(type, obj);
      // HACK: ugh... these change events were coming through
      // before the promise was resolving in the adapter. This
      // means the record was still in flight when we attempted
      // this push. Somehow we were ending up with two records
      // in the store with the same id. I think this is an ED
      // bug, but this works around it for now.
      //
      // Perhaps we should just check for inflight records before
      // pushing into the store?
      Ember.run.next(this, function(){
        Ember.run.next(this, function(){
          this.push(data);
        });
      });
    };

    let remove = (obj) => {
      let record = this.peekRecord(obj.type, obj.id);
      if (record && !get(record, 'isDeleted')) {
        record.unloadRecord();
      }
    };

    let reset = () => {
      this.unloadAll();
    };

    this.get('hoodie.store').on('add', update);
    this.get('hoodie.store').on('update', update);
    this.get('hoodie.store').on('remove', remove);
    this.get('hoodie.account').on('signout', reset);
  }
});
