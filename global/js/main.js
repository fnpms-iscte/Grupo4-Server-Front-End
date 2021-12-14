const socket = io();
const uploadFiles = document.getElementById("uploadFiles-form");
var uploader = new SocketIOFileUpload(socket);
let id

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

socket.on('results' , () =>{
    uploadFiles.submit()
});

uploadFiles.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();
    const fileRoom = document.getElementById("formFileRoom");
    const fileLecture = document.getElementById("formFileLecture");
    console.log(fileRoom.files[0]);
    console.log(fileLecture.files[0]);
    var id_form = document.getElementById("id");
    id_form.value = id
    const file_rooms = new File([fileRoom.files[0]], id+"_"+"rooms")
    const file_lectures = new File([fileLecture.files[0]], id+"_"+"lectures")

    let files_array = [
        file_rooms,
        file_lectures
    ]   

    console.log("Files sent\n",files_array);
    
    uploader.submitFiles(files_array);    
}                                                                                                       

