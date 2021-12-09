const socket = io();
const uploadFiles = document.getElementById("uploadFiles-form");

var uploader = new SocketIOFileUpload(socket);


socket.emit('user', )

socket.on('message', message =>{
    console.log(message)
});

uploadFiles.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();
    const fileRoom = document.getElementById("formFileRoom");
    const fileLecture = document.getElementById("formFileLecture");
    console.log(fileRoom.files[0]);
    console.log(fileLecture.files[0]);
    let files_array = [
        fileRoom.files[0],
        fileLecture.files[0]
    ]
    console.log("XXXXXXXXXXX Files sent",files_array);
    
    uploader.submitFiles(files_array);

    body = { 
        id: socket.id,
        files: uploader,
    }

    socket.emit('filesSent', body);
    /*const options = {
        method: 'post',
        body: formData
    }*/
   /* fetch('/', )
        .then((res) => console.log(res))
        .catch((err) => ("Error occured", err));
    location.href = '/success';*/
}                                                                                                       

