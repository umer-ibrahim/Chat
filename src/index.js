const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const ConnectedUser = [];


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


io.on('connection', (socket) => {
    
    socket.on("writing",data=>{
      ConnectedUser[data.for].emit("writing","");
    })
    
    socket.on('User', (msg) => {
      if(!ConnectedUser[msg.sender]){
        ConnectedUser[msg.sender] = socket;
        if(ConnectedUser[msg.to]){
          ConnectedUser[msg.sender].emit('Indicator', "Now Your Partner is Already online");
          ConnectedUser[msg.to].emit('Indicator', "Now Your Partner is Online");
        }
      }
      if(ConnectedUser[msg.to]){
        
        if(msg.msg !== ""){
          ConnectedUser[msg.to].emit('User', {
            sender: msg.sender,
            msg: msg.msg
          });
        }
      }
      else{
        console.log(ConnectedUser[msg.sender].id);
        ConnectedUser[msg.sender].emit('Indicator', "We inform you when your user is online");
      }
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});