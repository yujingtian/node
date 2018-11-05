const socket = io("/")
socket.on("connect", () => {
    console.log("连接成功")
    socket.emit('getHistory')
})


//回车发送消息的方法
function enterSend(e){
    let code = event.keyCode;
    if(code === 13) send();
}

input.onkeydown = function(e){
    enterSend(e)
}

function join(room) {
    socket.emit('join', room)
}
socket.on('joined',room =>{
    document.getElementById(`join-${room}`).style.display = 'none'
    document.getElementById(`leave-${room}`).style.display = 'inline-block'
})

function leave(room){
    socket.emit('leave',room)
}

socket.on('leaved', room => {
    document.getElementById(`join-${room}`).style.display = 'inline-block'
    document.getElementById(`leave-${room}`).style.display = 'none'
})

socket.on("message", (data) => {
    let li = document.createElement("li");
    li.className = 'list-group-item';
    li.innerHTML = `
        <p style="color:#ccc">
            <span class="user"  style="${data.color}">${data.user}</span>
            ${data.createAt}
        </p>
        <p class="content" style="background:${data.color}">
            ${data.content}
        </p>
    `
    list.appendChild(li)
    list.scrollTop = list.scrollHeight
})
socket.on('history', history => {
    // history拿到的是一个数组，所以用map映射成新数组，然后再join一下连接拼成字符串
       let html = history.map(data => {
               return `<li class="list-group-item">
            <p style="color: #ccc;"><span class="user" style="color:${data.color}">${data.user} </span>${data.createAt}</p>
            <p class="content" style="background-color: ${data.color}">${data.content}</p>
        </li>`;
       }).join('');
       list.innerHTML = html + '<li style="margin: 16px 0;text-align: center">以上是历史消息</li>';
    // 将聊天区域的滚动条设置到最新内容的位置
       list.scrollTop = list.scrollHeight;
});


function privateChat(e){
    let target = event.target;
    let user = target.innerHTML;
    if(target.className == 'user'){
        input.value = `@${user}`
    }
}

list.onclick = function(e){
    privateChat(e
        );
}

// socket.on("disconnect", () => {
//     console.log("断开链接成功")
// })