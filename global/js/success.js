const socket = io();

socket.on('welcome', message=>{
    console.log(message,id)
    socket.emit('user', )
} )

socket.on('welcome', message=>{
    console.log(message,id)
    socket.emit('user', )
} )

socket.on('user-id', socketid =>{
    console.log("My id is:",socketid)
    id = socketid;
})

socket.on('message', message =>{
    console.log(message,id)
});