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

socket.on('results' , () =>{
    console.log("Os resultados chegaram :)")
    uploadFiles.submit()
});

socket.on('message', message =>{
    console.log(message,id)
});

socket.on('user_headers', headers =>{
    console.log(headers)
    console.log(default_headers)
});

const form  = document.getElementById('form-headers');

form.addEventListener('submit', (event) => {
    console.log(event);
});