var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

var TodoService = require('./service/todo-service');
var todoService = new TodoService();

server.listen(3000);

app.use(express.static('../client'));
app.use(bodyParser.json());

// GET
app.get('/todo', function (req, res) {
  todoService.list()
    .then(function (docs) {
      res.json(docs);
    })
    .catch(function(err) {
      res.status(500).send(err);
    })
});

// CREATE
app.post('/todo', function (req, res) {
  var doc = req.body;
  todoService.save(doc)
    .then(function(saved) {
      res.json(saved)
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

// UPDATE
app.put('/todo/:id', function (req, res) {
  var doc = req.body;
  todoService.save(doc)
    .then(function(saved) {
      res.json(saved)
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

// DELETE
app.delete('/todo/:id', function (req, res) {
  todoService.remove(req.params.id)
    .then(function() {
      res.status(204).send();
    })
    .catch(function(err) {
      res.status(500).send(err);
    })
});


// socket.io config
io.on('connection', function (socket) {
  socket.emit('hello');

  todoService.on('doc-updated', function(doc) {
    socket.emit('updated', doc);
  });

  todoService.on('doc-deleted', function(doc) {
    socket.emit('deleted', doc);
  });
});