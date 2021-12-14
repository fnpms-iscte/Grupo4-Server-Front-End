const socket = io();
let old_id

socket.on('welcome', message=>{
    console.log(message,id)
    socket.emit('user', )
} )

socket.on('welcome', message=>{
    console.log(message,id)
    socket.emit('user', )
} )

socket.on('old-user-id', oldsocketid =>{
    console.log("My old id is:",oldsocketid)
    old_id = oldsocketid;
})

socket.on('user-id', socketid =>{
    console.log("My id is:",socketid)
    id = socketid;
})

socket.on('message', message =>{
    console.log(message,id)
});