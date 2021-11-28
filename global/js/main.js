const socket = io();
const uploadFiles = document.getElementById("uploadFiles-form");

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
    const formData = new FormData();
    formData.append("files", fileRoom.files[0]);
    formData.append("files", fileLecture.files[0]);
    const options = {
        method: 'post',
        body: formData
    }
    fetch('/', options)
        .then((res) => console.log(res))
        .catch((err) => ("Error occured", err));
    location.href = '/success';
}