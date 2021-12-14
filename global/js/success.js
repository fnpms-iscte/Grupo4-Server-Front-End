const socket = io();
let old_id
let id

socket.on('welcome', message=>{
    console.log(message,id)
    socket.emit('user', )
} )

socket.on('old-user-id', old_socketid =>{
    console.log("My old id is:",old_socketid)
    old_id = old_socketid;
})

socket.on('user-id', socketid =>{
    console.log("My id is:",socketid)
    id = socketid;
})

socket.on('message', message =>{
    console.log(message,id)
});