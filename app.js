var express = require('express');
var app = express();
var path = require('path');

// Database hook up
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/wishes')

var http = require('http').Server(app);

var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// database implentation needed
var collection = db.get('wish');

io.on('connection', function(socket){
  console.log('a user connected');

  // On connection, send down the latest wish
  collection.findOne({},{sort : {_id : -1}},function(e,doc){
		//console.log('p: ' + doc.phrase);

		io.emit('fulfill',doc);
	});

  /**
	 * .Wish
	 *
	 * When a wish is made, insert it to the db
   **/
  socket.on('wish', function(data) {
  	// insert wish to the db with a random identifier
  	collection.insert({phrase:data.wish,cc:data.country,randID:Math.random()});
  });

  /**
	 * .Fulfill
	 *
	 * Send the latest published wish in the db to the user
   **/
  socket.on('fulfill', function() {
  	collection.findOne({},{sort : {_id : -1}},function(e,doc){
			//console.log('p: ' + doc.phrase);

			io.emit('fulfill',doc);
		});
  });

  /**
	 * .Random
	 *
	 * When the latest wish is stale, find a random wish in the db to send back
	 * to the user
   **/
	socket.on('random', function() {

  	collection.findOne({randID: {$gte: Math.random()}},{},function(e,doc) {
			if (doc) {
				io.emit('random',doc);
			} else {
				collection.findOne({randID: {$lte: Math.random()}},{},function(e,doc) {	
					io.emit('random',doc);
				});
			}
		});
	});

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});