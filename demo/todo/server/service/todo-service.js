var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Promise = require('bluebird');
var nano = require('nano')('http://localhost:5984');
var db = Promise.promisifyAll(nano.db.use('todos'));
var _ = require('lodash');

function TodoService() {
  EventEmitter.call(this);

  var _this = this;

  //Setup follow feed
  var feed = db.follow({since: 'now'});
  feed.on('change', function (doc) {
    if (doc.deleted) {
      _this.emit('doc-deleted', doc.id);
    } else {
      _this.findById(doc.id)
        .then(function (doc) {
          _this.emit('doc-updated', doc);
        });
    }
  });
  feed.follow();
}

util.inherits(TodoService, EventEmitter);

TodoService.prototype.list = function () {
  return new Promise(function (resolve, reject) {
    db.view('views', 'all', function (err, body) {
      if (!!err) {
        reject(err);
      } else {
        resolve(body.rows.map(function (row) {
          return row.value;
        }))
      }
    });
  });
};

TodoService.prototype.findById = function (docId) {
  return new Promise(function (resolve, reject) {
    db.get(docId, function (err, body) {
      if (!!err) {
        reject(err);
      } else {
        resolve(body);
      }
    })
  });
};

TodoService.prototype.save = function(doc) {
  return new Promise(function(resolve, reject) {
    db.insert(doc, function(err, body) {
      if(!!err) {
        reject(err)
      } else {
        resolve(body);
      }
    });
  })
};

TodoService.prototype.remove = function(docId) {
  var _this = this;
  return this.findById(docId)
    .then(function(doc) {
      doc._deleted = true;
      return _this.save(doc);
    });
};

module.exports = TodoService;