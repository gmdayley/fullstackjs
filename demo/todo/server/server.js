var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')

var TodoService = require('./service/todo-service');
var todoService = new TodoService();

server.listen(3000);

io.on('connection', function (socket) {
  todoService.on('doc-updated', function(doc) {
    socket.emit('updated', doc);
  });

  todoService.on('doc-deleted', function(doc) {
    socket.emit('deleted', doc);
  });
});

app.use(express.static('../client'));
app.use(bodyParser.json());

app.get('/todo', function (req, res) {
  todoService.list()
    .then(function (docs) {
      res.json(docs);
    })
});

// accept POST request on the homepage
app.post('/todo/:id', function (req, res) {
  res.send('Got a POST request');
});

// accept PUT request at /user
app.put('/todo/:id', function (req, res) {
  var doc = req.body;
  console.log(doc);
  todoService.save(doc);
  res.send('Got a PUT request at /user');
});

// accept DELETE request at /user
app.delete('/todo/:id', function (req, res) {
  res.send('Got a DELETE request at /user');
});