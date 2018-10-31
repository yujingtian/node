let ws = new WebSocket('ws:localhost:9999')

ws.onopen = function(){
    ws.send("不错哦，已经连接上了")
}

ws.onmessage = function(res){
    console.log(res)
    console.log(res.data)
}