const express = require("express")
const app = express();

app.use(express.static(__dirname,{index:"indexs.html"}))   //设置静态文件

const server = require("http").createServer(app)
const io = require("socket.io")(server)


app.listen(3000,function(){
    console.log("开始监听3000端口")
})

const Server = require("ws").Server;

const ws = new Server({port:9999})

ws.on('connection',function(socket){
    socket.on("message", function (msg){
        console.log(msg);
        socket.send(`这是服务器对你说的话：${msg}`)
    })
})