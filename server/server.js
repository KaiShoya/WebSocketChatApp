var http = require("http");
var socketio = require("socket.io");
var fs = require("fs");
var path = require('path');
var session = require('express-session');
var mime = {
  ".html": "text/html",
  ".css" : "text/css",
  ".js"  : "text/javascript"
  // ".png" : "image/png",
  // ".jpg" : "image/jpeg",
  // ".txt" : "text/plain"
};

var server = http.createServer(function(req, res) {
  var Users = mongoose.model('User');
  var id = req.body.id;
  var pass = req.body.password;
  Users.findOne({ "id": id},function(err, user){
    if(err) {
      console.log(err);
    } else {
      if(user.password === pass){
      req.session.username = id;
      res.render('index', {name: req.session.username});
    } else {
      res.render('login');
    }
    }
  });

  if (req.url == '/')
    filePath = '/index.html';
  else
    filePath = req.url;

  res.writeHead(200, {"Content-Type": mime[path.extname(filePath)] || "text/plain"});
  fs.readFile(__dirname + filePath, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.end(data, 'UTF-8');
    }
  });
}).listen(process.env.PORT || 3000);

var io = socketio.listen(server);

io.sockets.on("connection", function (socket) {
  var user = {name:"unknown", id: undefined, email: undefined};
  console.log(socket.handshake.query);
  console.log(socket.handshake.query.name);
  if(typeof socket.handshake.query.name != "undefined") {
    user = {
      name : socket.handshake.query.name,
      id : socket.handshake.query.id,
      email : socket.handshake.query.email,
    }
  }
  io.sockets.emit("S_to_C_message", {value:user.name + " connection"});

  // メッセージ送信（送信者にも送られる）
  socket.on("C_to_S_message", function (data) {
    io.sockets.emit("S_to_C_message", {value:user.name + ":" + data.value});
  });

  // // ブロードキャスト（送信者以外の全員に送信）
  // socket.on("C_to_S_broadcast", function (data) {
  //   socket.broadcast.emit("S_to_C_message", {value:data.value});
  // });

  // 切断したときに送信
  socket.on("disconnect", function () {
    io.sockets.emit("S_to_C_message", {value:user.name +" disconnected"});
  });
});
