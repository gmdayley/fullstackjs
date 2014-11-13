(function() {
  var socket = io.connect('http://localhost');

  socket.on('hello', function() {
    console.log('hello there');
  });

  socket.on('deleted', function (docId) {
    var todo = app.todos.get(docId);
    if (todo) {
      app.todos.remove(todo);
    }
  });

  socket.on('updated', function (doc) {
    var todo = app.todos.get(doc._id);
    if (todo) {
      //update
      todo.set(doc);
    } else {
      //create
      app.todos.create({
        _id: doc._id,
        title: doc.title,
        completed: doc.completed,
        order: app.todos.nextOrder()
      });
    }
  });
})(io);