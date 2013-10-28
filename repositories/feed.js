angular.module('system').factory('feed', [function () {
  function Feed() {
    var self = this;
    var db = new PouchDB('feed');
    var remoteCouch = 'http://localhost:5984/livesystem';
    

    var subscription = null;

    var extractDocs = function (item) {
          return item.doc;
    };
    var undeleted = function (item) {
      return !item._deleted;
    };

    self.sync = function () {
      
      var opts = {continuous: true, complete: function (err) {
        console.log('complete handler', err)
      }};
      db.replicate.to(remoteCouch, opts);
      db.replicate.from(remoteCouch, opts);
    };

    self.items = function (callback) {
      self.sync();
      db.info(function(err, info) {
        var seq = info.update_seq;
        console.log(info);
        
        db.allDocs({include_docs: true, ascending: false}, function (err, docs) {
          if (!err) {
            callback(docs.rows.map(extractDocs).filter(undeleted));
          }
      });

        subscription = db.changes({
          since: seq,
          include_docs: true,
          continuous: true,
          onChange: function(change) {
            console.log('change occurred', change.doc);
            if (!change.doc._deleted) {
              callback([change.doc]);
            }
          }
        });

      }); // info
    };


    self.save = function (item, callback) {
      db.post(item, callback);
    };

    self.update = function (feedItem) {
      console.log('updated', feedItem);
      var rev = feedItem._rev;
      db.remove(feedItem);
      feedItem._rev = (parseInt(feedItem._rev.substr(0, 1), 10) + 1) + feedItem._rev.substr(1)
      console.log('trying to put', feedItem._id, rev, 'as', feedItem._rev);
      db.put(feedItem, {}, function (err) {
        console.log(err);
      });
    };
  }
  return new Feed();

}]);