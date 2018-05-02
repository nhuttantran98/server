var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var express = require("express")
var ip = require("ip")
const mqtt = require('mqtt')
var client = mqtt.connect({
    host: "192.168.43.48",
    port: 2000
    // ,
    // username: "vhnyvxsu",
    // password: "vVA4tmFkLz-k"
})

client.on('connect', function () {
    console.log('mqtt connected!');
    client.subscribe('espToServer',function(data){
        console.log(data+"aaa");
    });
})

client.on('message', function (topic, message) {
    console.log(message.toString() + 'zzzz')
    io.sockets.emit("serverToWeb", message.toString());
})

app.use(express.static("public"))
app.set("view engine", "ejs")
app.set("views", "./views")
io.on('connection', function (socket) {
    console.log("co nguoi ket noi")
    // socket.on("buttonsenddata", function(data){
    //     console.log(data)
    //     io.sockets.emit("serversendbutton", data)
    //     client.publish('ESP32',data)
    // })
    // client.on("message",function(data){
    //     console.log(data.toString.toString()+"console at web");
    //     io.sockets.emit("serverToWeb",data.toString());
    // })
    
    socket.on("webToServer", function (data) {
        var a, b;
        console.log(data);
        if (data == 'ON') {
            client.publish('ESP32', "ON");
        }
        else if (data == 'OFF') {
            client.publish('ESP32', "OFF");
        }
        else if (data.status == 'setTurnOn') {
            a = setTimeout(() => {
                client.publish('ESP32', "ON");
                console.log("aaaaa");
            }, data.time)
        }
        else if (data.status == 'setTurnOff') {
            b = setTimeout(() => {
                client.publish('ESP32', "OFF");
            }, data.time)
        }
        else if (data.status == 'cancelTurnOn'){
            clearTimeout(a);
        }
        else if (data.status == 'cancelTurnOff'){
            clearTimeout(b);
        }
        io.sockets.emit("serverToWeb", data);
    })
});
server.listen(1000);
console.log("Server nodejs started")