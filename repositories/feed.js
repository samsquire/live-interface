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


    self.ids = {};
    self.items = [];

    self.addition = function (docs) {
      docs.forEach(function (doc) {
        if (self.ids.hasOwnProperty(doc._id)) {
          console.log("Change to existing document:", doc._id);
          // console.log('already existing doc', doc, doc._id);
          $.extend(true, self.ids[doc._id], doc);

        } else {
          self.ids[doc._id] = doc;
          self.items.push(doc);
        }
      });
    };

    self.sync = function () {
      
      var opts = {continuous: true, complete: function (err) {
        // console.log('complete handler', err)
      }};
      db.replicate.to(remoteCouch, opts);
      db.replicate.from(remoteCouch, opts);
    };

    self.fetch = function (callback) {
      self.sync();
      db.info(function(err, info) {
        var seq = info.update_seq;
        
        db.allDocs({include_docs: true, ascending: false}, function (err, docs) {
          if (!err) {
            self.addition(docs.rows.map(extractDocs).filter(undeleted));
            callback(self.items);
          }
      });

        subscription = db.changes({
          since: seq,
          include_docs: true,
          continuous: true,
          onChange: function(change) {
            if (!change.doc._deleted) {
              self.addition([change.doc])
              callback(self.items);
            }
          }
        });

      }); // info
    };


    self.save = function (item, callback) {
      db.post(item, callback);
    };

    self.update = function (feedItem) {
      console.log('Updated', feedItem);
      var rev = feedItem._rev;
      db.remove(feedItem);
      var revNumber = (parseInt(feedItem._rev.substr(0, 2), 10) + 1);
      feedItem._rev = revNumber + feedItem._rev.substring(feedItem._rev.indexOf("-"));
      console.log(revNumber, 'From', rev, 'to', feedItem._rev);
      db.put(feedItem, {}, function (err) {
        console.log(err);
      });
    };
  }
  return new Feed();

}]);