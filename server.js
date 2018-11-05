const express = require("express")
const app = express();

app.use(express.static(__dirname,{index:"indexs.html"}))   //设置静态文件

const server = require("http").createServer(app)
const io = require("socket.io")(server)


const SYSTEM = '系统';
let socketObj = {};
let userColor = ['#00a1f4', '#0cc', '#f44336', '#795548', '#e91e63', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#ffc107', '#607d8b', '#ff9800', '#ff5722']
let mysocket = {}
let msgHistory = [];


function shuffle(arr){
    let len = arr.length,random;
    while(0 !== len)
    {
        random = (Math.random() * len--)>>>0;
        [arr[len],arr[random]] = [arr[random],arr[len]];
    }
    return arr;
}


io.on("connection",function(socket){   
    let username;
    let color;
    let room = [];
    mysocket[socket.id] = socket;
    socket.on('message',function(msg){
        if (username) {
            //正则判断消息是否为私聊专属
            let private = msg.match(/@([^ ]+)(.+)/);
            if (private) {
                //私聊的用户，正则匹配的第一个分组
                let toUser = private[1];
                //私聊的内容，正则匹配的第二个分组
                let content = private[2];
                //从socketObj中获取用户的socket
                let toSocket = socketObj[toUser];
                if (toSocket) {
                    //私聊的用户发消息
                    toSocket.send({
                        user:username,
                        color,
                        content,
                        createAt:new Date().toLocaleDateString()
                    })
                }
            }
            else{
                if(rooms.length)
                {
                    let socketJson = {};
                    rooms.forEach(room =>{
                        // 取得进入房间内所对应的所有sockets的hash值，它便是拿到的socket.id
                        let roomSockets = io.sockets.adapter.rooms[room].sockets;
                        Object.keys(roomSockets).forEach(socketId => {
                            console.log('socketId',socketId)
                            if(!socketJson[socketId])
                            {
                                socketJson[socketId] = 1;
                            }
                        })
                    })
                    Object.keys(socketJson).forEach(socketId => {
                        mySocket[socketId].emit("message",{
                            user:message,
                            color,
                            content:msg,
                            createAt: new Date().toLocaleString()
                        })
                    })
                }
                else
                {
                    io.emit('message', {
                        user: username,
                        color,
                        content: msg,
                        createAt: new Date().toLocaleString()
                    });
                    msgHistory.push({
                        user:username,
                        color,
                        content:msg,
                        createAt:new Date().toLocaleDateString()
                    })
                }
            }
        }
        else {
            username = msg;
            color = shuffle(userColor)[0];
            socket.broadcast.emit('message', {
                user: SYSTEM,
                color,
                content: `${username}加入聊天`,
                createAt: new Date().toLocaleDateString()
            })
            socketObj[username] = socket;
        }
    })
    socket.on("getHistory",()=>{
        if(msgHistory.length)
        {
            let history = msgHistory.slice(msgHistory.length - 20)
            socket.emit("history",history)
        }
    })
    socket.on("join",function(room){
        if(username && rooms.indexOf(room) === -1)
        {
            socket.join(room)
            room.push(room);
            socket.emit('joined',room)
            socket.send({
                user:SYSTEM,
                color,
                content:`你已加入${room}战队`,
                createAt:new Date().toLocaleDateString()
            })
        }
    })
    socket.on("leave", function (room) {
        let index = rooms.indexOf(room);
        if (index == -1) {
            socket.leave(room)
            room.splice(index,1);
            socket.emit('joined', room)
            socket.send({
                user: SYSTEM,
                color,
                content: `你已离开${room}战队`,
                createAt: new Date().toLocaleDateString()
            })
        }
    })
})

server.listen(3000,function(){
    console.log("开始监听3000端口")
})
// app.listen(3000,function(){
//     console.log("开始监听3000端口")
// })

// const Server = require("ws").Server;

// const ws = new Server({port:9999})

// ws.on('connection',function(socket){
//     socket.on("message", function (msg){
//         console.log(msg);
//         socket.send(`这是服务器对你说的话：${msg}`)
//     })
// })