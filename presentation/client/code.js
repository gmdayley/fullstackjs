// 2.1
var o = {
  foo: function() {
    console.log(this);
  }
}
o.foo();

// 3.1
var fn = function() {
  var foo = function() {
    console.log(this);
  }
  foo();
}
fn();

// 3.2
var Fn = function() {
  var foo = function() {
    console.log(this);
  }
  foo();
}
new Fn(); 

// 3.3
var fn = function() {
  this.foo = function() {
    console.log(this);
  }
  this.foo();
}
fn();

// 3.4
var Fn = function() {
  this.foo = function() {
    console.log(this);
  }
  this.foo();
}
new Fn();

// 6.1
var Fn = function() {
  this.foo = function() {
    console.log(this);
  }
  this.foo();
}
var fn2 = function(callback) {
	callback()
}
new fn2(new Fn().foo);

// 4.1
var $el = document.getElementById('impress');
function event(a, b, c) {
	console.log(this);
}
event.call($el, 'a', 'b', 'c');

// 5.1
var $el = document.getElementById('impress');
function event(a, b, c) {
	console.log(this);
}
event.apply($el, ['a', 'b', 'c']);

// 7.1
function MyObject() {
  eval("console.log(this);");
}
new MyObject();

// x.1 // Basic support: 	CHROME 7	FIREFOX 4.0		IE 9	OPERA 11.60		SAFARI 5.1.4
var $el = document.getElementById('impress');
function event(a, b, c) {
	console.log(this);
}
var e = event.bind($el);
e('a', 'b', 'c');
