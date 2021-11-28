const form = document.getElementById("form");

form.addEventListener("submit", submitForm);

function submitForm(e) {
    console.log("Oi?")
    e.preventDefault();
    const fileRoom = document.getElementById("formFileRoom");
    const fileLecture = document.getElementById("formFileLecture");
    console.log(fileRoom.files[0]);
    console.log(fileLecture.files[0]);
    const formData = new FormData();
    formData.append("files", fileRoom.files[0]);
    formData.append("files", fileLecture.files[0]);
    fetch('http://localhost:3000/', {
        method: 'post',
        body: formData
    })
        .then((res) => console.log(res))
        .catch((err) => ("Error occured", err));
}