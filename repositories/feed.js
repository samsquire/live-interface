angular.module('system').factory('feed', ['cleaner', function (cleaner) {
  function Feed() {
    var self = this;
    var db = new PouchDB('feed');
    var remoteCouch = 'http://sampc:5984/livesystem';
    

    var subscription = null;

    var extractDocs = function (item) {
          return item.doc;
    };
    var undeleted = function (item) {
      return !item._deleted;
    };


    self.ids = {};
    self.items = [];
    self.waiting = {};

    self.waitFor = function (id, callback) {
      self.waiting[id] = callback;
    }

    self.addition = function (docs) {
      docs.forEach(function (doc) {
        if (self.ids.hasOwnProperty(doc._id)) {
          console.log("Change to existing document:", doc._id);
          // console.log('already existing doc', doc, doc._id);
          $.extend(true, self.ids[doc._id], doc);

        } else {
          self.ids[doc._id] = doc;
          self.items.push(doc);
          if (self.waiting[doc._id]) {
            self.waiting[doc._id](doc);
            delete self.waiting[doc._id];
          }
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

    self.update = function (feedItem, callback) {
      console.log('Updated', feedItem);
      var rev = feedItem._rev;
      db.remove(feedItem);
      var revNumber = (parseInt(feedItem._rev.substr(0, 2), 10) + 1);
      feedItem._rev = revNumber + feedItem._rev.substring(feedItem._rev.indexOf("-"));
      console.log(revNumber, 'From', rev, 'to', feedItem._rev);
      db.put(feedItem, {}, function (err) {
        console.log(err);
      });
      callback(feedItem);
    };

    self.inplaceUpdate = function (callback) {
      return function (feedItem) {
        console.log(cleaner);
        feedItem.contents = cleaner.filter(feedItem.html).html();
        delete feedItem.html;
        console.log(JSON.stringify(feedItem, null, 4));
        self.update(feedItem, callback);
      }
    };


  }
  return new Feed();

}]);