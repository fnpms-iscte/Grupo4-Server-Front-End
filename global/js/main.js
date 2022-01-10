const socket = io();
const uploadFiles = document.getElementById("uploadFiles-form");
var uploader = new SocketIOFileUpload(socket);
uploader.chunkSize = 100 * 1024 * 1024;
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
    console.log("Os resultados chegaram :)")
    uploadFiles.submit()
});

socket.on('user_headers', headers =>{
    console.log(headers)
    uploadFiles.submit()
});

uploadFiles.addEventListener("submit", submitForm);

function json_to_csv(horario) {
	const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
	const header = Object.keys(horario[0])
	const csv = [
		header.join(';'), // header row first
		...horario.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'))
	].join('\r\n')


	return csv
}
function submitForm(e) {
    e.preventDefault();
    const fileRoom = document.getElementById("formFileRoom");
    const fileLecture = document.getElementById("formFileLecture");
    var id_form = document.getElementById("id");
    id_form.value = id
    let file_rooms
    let file_lectures
    if(fileRoom.files[0].name.endsWith(".csv")){
        file_rooms = new File([fileRoom.files[0]], id+"_"+"rooms.csv")
        file_lectures = new File([fileLecture.files[0]], id+"_"+"lectures.csv")
    }
    if(fileRoom.files[0].name.endsWith(".json")){
        file_rooms = new File([fileRoom.files[0]], id+"_"+"rooms.json")
        file_lectures = new File([fileLecture.files[0]], id+"_"+"lectures.json")
    }
    if(fileRoom.files[0].name.endsWith(".xml")){
        file_rooms = new File([fileRoom.files[0]], id+"_"+"rooms.xml")
        file_lectures = new File([fileLecture.files[0]], id+"_"+"lectures.xml")
    }
    let files_array = [
        file_rooms,
        file_lectures
    ]   
    uploader.submitFiles(files_array);    
    console.log("files sent");
}                                                                                                       

