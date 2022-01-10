const http = require('http');
const csvjson = require('csvjson');
const bodyParser = require('body-parser')
const socketio =  require('socket.io');
const express = require('express');
const siofu = require("socketio-file-upload");
const fs = require('fs');
const path = require('path');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const jQuery = require( "jquery" )( window );
async function initialize_d3(){
  return await import("d3");
}


const workers = []
const users = []
const default_room_headers = ["Edifício", "Nome sala", "Capacidade Normal", "Capacidade Exame", "Nº características", "Característica"]
const default_lecture_headers = ["Curso", "Unidade de execução", "Turno", "Turma", "Inscritos no turno (no 1º semestre é baseado em estimativas)", 
"Turnos com capacidade superior à capacidade das características das salas", "Turno com inscrições superiores à capacidade das salas", "Dia da Semana", "Início", "Fim", "Dia", "Características da sala pedida para a aula","Ignorar"];
let old_id;
const app = express();
const server = http.createServer(app)
const io = socketio(server);
const PORT =  process.env.PORT || 3000
app.use(siofu.router)
app.use(express.static('global'));
app.use(express.json());
app.set('view engine', 'ejs');
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
var socket;
app.use(express.urlencoded({ 
  extended: true
}))

// Run when client connects
io.on('connection', socket => {
  this.socket = socket;
  //console.log(this.socket)
  var uploader = new siofu();
  uploader.dir = "./uploads";
  uploader.listen(socket);
  
  socket.emit('welcome','Welcome to ISCTE');

  socket.on('user' , ()=>{
    if(this.old_id != null){

      socket.emit('old-user-id', this.old_id)
    }
     users.push({id : socket.id, files : {}, room_headers : [], lecture_headers : [], client_csv : []})
     
 
     socket.emit('user-id', socket.id)
  })

  socket.on('worker', token  =>{
    if (token == 659812) {
      workers.push(socket.id)
      console.log("Worker available")
      socket.to(users).emit('message', 'Worker available');
    }
  });

  socket.on('message', message=> {

    if (message == 'send json') {

      socket.to(workers[0]).emit('message', "envia res")
    }
  });

  uploader.on("saved", function(event){
    console.log("Ficheiros recebidos")
    if(event.file.name == (socket.id+"_lectures.csv")){
      let csv_content1 = fs.readFileSync('./uploads/'+socket.id+'_rooms.csv', { encoding: "utf8" });
      let csv_content2 = fs.readFileSync('./uploads/'+socket.id+'_lectures.csv', { encoding: "utf8" });
      var user_room_headers = get_headers(csv_content1);
      var user_lecture_headers = get_headers(csv_content2);
      var index = users.findIndex(function(user, i){
        return user.id === socket.id
     });
      //var json_aux = csv_to_json(csv_content1,csv_content2);
      users[index].room_headers = user_room_headers;
      users[index].lecture_headers = user_lecture_headers;
      users[index].client_csv = [csv_content1, csv_content2]; 
      socket.emit("user_headers",{ headers: user_room_headers, default_headers : default_room_headers})
      //socket.to(workers[0]).emit('files_to_handle',{files : json_aux, id: socket.id});
      fs.unlinkSync('./uploads/'+socket.id+'_rooms.csv')
      fs.unlinkSync('./uploads/'+socket.id+'_lectures.csv')
    }
    
  });

  socket.on('results', body =>{
    console.log("chegaram os resultados")
    //var id = JSON.parse(body).id
    var id = this.old_id
    console.log(id)
    var index = users.findIndex(function(user, i){
       return user.id === id
    });
    console.log(index)
    users[index].files = JSON.parse(body).Horarios
    console.log(users[index].files)
    socket.to(id).emit('results')
  });
  

  socket.on('disconnect', () => {
      var val = socket.id
      var index = users.findIndex(function(user, i){
        return user.id === val
      });

      if (index > -1) {
        //users.splice(index, 1);
        //console.log("\nUser with id",socket.id, "disconnected \nUsers:",users.length)
      }else{
        const index = workers.indexOf(socket.id) ;
        if (index > -1) {
          workers.splice(index, 1);


        }
      }
  })
});

app.get('/', (req,res) => {
  res.render('index', { title: ''} );
});

app.get('/dataprocessing_lectures', (req,res) =>{
  this.old_id = req.query.oldid;
  var id = this.old_id
  console.log(id);
  var index = users.findIndex(function(user, i){
    return user.id === id
  });
  console.log("Render data processing")
  res.render('dataprocessing_lectures', { title: 'Resultados do Horário' , old_id : this.old_id , headers : users[index].lecture_headers, default_headers: default_lecture_headers} );
})

app.get('/dataprocessing_rooms', (req,res) =>{
  this.old_id = req.query.oldid;
  var id = this.old_id
  var index = users.findIndex(function(user, i){
    return user.id === id
  });
  console.log("Render data processing")
  res.render('dataprocessing_rooms', { title: 'Resultados do Horário' , old_id : this.old_id , headers : users[index].room_headers, default_headers: default_room_headers} );
})

app.get('/success', async (req,res) => {

  this.old_id = req.query.oldid;



  var id = this.old_id
    var index = users.findIndex(function(user, i){
      return user.id === id
    });

  console.log(jQuery.isEmptyObject(users[index].files));
  while(jQuery.isEmptyObject(users[index].files)){
    console.log("sleeping")
    console.log(index)
    console.log(users[index].files)
    await sleep(1000);
  }
  res.render('success', { title: 'Resultados do Horário' , old_id : this.old_id , horarios : users[index].files } );
})

app.post('/success',  (req,res) => {
  
  old_id = req.body.old_id
  timetable_name = req.body.name

  var id = old_id
  var index = users.findIndex(function(user, i){
    return user.id === id
  });

  let csv

  users[index].files.forEach(horario => {

    if(horario.name == timetable_name){
      //convert json to csv

      csv = json_to_csv(horario.lectures)

    }

  })

  res.attachment('horario.csv').send(csv)
});

app.post('/dataprocessing_lectures', async (req,res) =>{
  console.log(req.body)
  console.log("Post do data processing");
  d3 = await initialize_d3();
  //console.log(req.body);
  req.body = JSON.parse(JSON.stringify(req.body));
  let count_course = 0;
  let count_execution_unity = 0; 
  let count_shift = 0;
  let count_class = 0;
  let count_shift_enrolment = 0;
  let count_shift_superior_capacity = 0;
  let count_shift_superior_registrations = 0;
  let count_week_day = 0;
  let count_start = 0;
  let count_end = 0;
  let count_day = 0;
  let count_characteristics = 0;
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
        if( -1 < req.body[key] && req.body[key] < 12){
          switch(req.body[key]){
            case "0":
              count_course++;
              break;
            case "1":
              console.log('Room name');
              count_execution_unity++;
              break;
            case "2":
              console.log('Normal Capacity');
              count_shift++;
              break;
            case "3":
              console.log('Exam capacity');
              count_class++;
              break;
            case "4":
              count_shift_enrolment++;
              break;
            case "5":
              count_shift_superior_capacity++;
              break;
            case "6":
              count_shift_superior_registrations++;
              break;
            case "7":
              count_week_day++;
              break;
            case "8":
              count_start++;
              break;
            case "9":
              count_end++;
              break;
            case "10":
              count_day++;
              break;
            case "11":
              count_characteristics++;
              break;
            default:
              console.log('lol');
          }
          //console.log(key + " -> " + req.body[key]);
        }
    }
  }
  if(count_course != 1 || count_execution_unity != 1 || count_shift != 1 || count_class != 1 || 
    count_shift_enrolment != 1 || count_shift_superior_capacity != 1 || count_shift_superior_registrations != 1 || count_week_day != 1 
    || count_start != 1 || count_end != 1 || count_day != 1 || count_characteristics != 1 ){
    console.log("ERRO");
  }else {
    var total_length = count_course + count_execution_unity + count_shift + count_class + count_shift_enrolment + count_shift_superior_capacity 
    + count_shift_superior_registrations + count_week_day + count_start + count_end + count_day + count_characteristics
    console.log(req.body.old_id)
    var id = req.body.old_id
    var index = users.findIndex(function(user, i){
      return user.id === id
    });

    var arrObj = [];
    var lines = users[index].client_csv[1].split('\n');
    var headers = lines[0].split(';');
    console.log(users[index].client_csv[1])
    const data = d3.dsvFormat(";").parse(users[index].client_csv[1]);
    console.log(data.columns)
    for(let i = 0 ; i < total_length; i++ ){
      for (var key2 in req.body) {
        if (req.body.hasOwnProperty(key2)) {
          //console.log(typeof req.body[key2])
          if( -1 < req.body[key2] && req.body[key2] < 12){
            //console.log(key2 + " -> " + req.body[key2]);
            //console.log(data.columns[i])
            if(key2 == data.columns[i]){
              console.log("ALTEREI");
              data.columns[i] = default_lecture_headers[req.body[key2]]
            }
          }
        }
      }
    }
    //console.log(data.columns);
    lines[0] = data.columns.join(';');
    users[index].client_csv[1] = lines.join('\n');
    console.log(users[index].client_csv[1])
    console.log("redirecting")
    console.log("post");
    var string = encodeURIComponent(id);
    var json_aux = csv_to_json(users[index].client_csv[0],users[index].client_csv[1]);
    //console.log(this.socket)
    this.socket.to(workers[0]).emit('files_to_handle',{files : json_aux, id: this.socket.id});
    res.redirect('/success?oldid=' + string);
  }
})

app.post('/dataprocessing_rooms', async (req,res) =>{
  console.log("Post do data processing");
  d3 = await initialize_d3();
  //console.log(req.body);
  req.body = JSON.parse(JSON.stringify(req.body));
  let count_buildings = 0
  let count_room_names = 0 
  let count_normal_capacity = 0
  let count_exam_capacity = 0
  let count_characteristics = 0
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
        if( -1 < req.body[key] && req.body[key] < 5){
          switch(req.body[key]){
            case "0":
              console.log('Building');
              count_buildings++;
              break;
            case "1":
              console.log('Room name');
              count_room_names++;
              break;
            case "2":
              console.log('Normal Capacity');
              count_normal_capacity++;
              break;
            case "3":
              console.log('Exam capacity');
              count_exam_capacity++;
              break;
            case "4":
              count_characteristics++;
              break;
            default:
              console.log('lol');
          }
          //console.log(key + " -> " + req.body[key]);
        }
    }
  }
  console.log("Buildings: ", count_buildings)
  console.log("Room name: ", count_room_names)
  console.log("Normal capacity: ", count_normal_capacity)
  console.log("Exam capacity: ", count_exam_capacity)
  console.log("count exam capacity: ", count_characteristics)
  if(count_buildings != 1 || count_room_names != 1 || count_normal_capacity != 1 || count_exam_capacity != 1 || count_characteristics < 1){
    console.log("ERRO");
  }else {
    var total_length = count_buildings + count_room_names + count_normal_capacity + count_exam_capacity + count_characteristics
    console.log(req.body.old_id)
    var id = req.body.old_id
    var index = users.findIndex(function(user, i){
      return user.id === id
    });

    var arrObj = [];
    var lines = users[index].client_csv[0].split('\n');
    var headers = lines[0].split(';');
    console.log(users[index].client_csv[0])
    const data = d3.dsvFormat(";").parse(users[index].client_csv[0]);
    console.log(data.columns)
    for(let i = 0 ; i < total_length; i++ ){
      for (var key2 in req.body) {
        if (req.body.hasOwnProperty(key2)) {
          //console.log(typeof req.body[key2])
          if( -1 < req.body[key2] && req.body[key2] < 5){
            //console.log(key2 + " -> " + req.body[key2]);
            //console.log(data.columns[i])
            if(key2 == data.columns[i]){
              console.log("ALTEREI");
              data.columns[i] = default_room_headers[req.body[key2]]
            }
          }
        }
      }
    }
    //console.log(data.columns);
    lines[0] = data.columns.join(';');
    users[index].client_csv[0] = lines.join('\n');
    console.log(users[index].client_csv[0])
    console.log("redirecting")
    console.log("post");
    var string = encodeURIComponent(id);
    res.redirect('/dataprocessing_lectures?oldid=' + string);
  }
})

app.post('/',  (req,res) => {

  this.old_id = req.body.id
  console.log("post");
  var string = encodeURIComponent(this.old_id);
  console.log("redirecting")
  res.redirect('/dataprocessing_rooms?oldid=' + string);
  //res.redirect(302,'/success', {id: old_id} )

});

app.use((req, res) => {
  res.render('404', { title: '| 404 Error'} );
});

function csv_to_json(fileContent1, fileContent2){
  var options = {
    delimiter : ';'

  };
  let jsonObj1 = csvjson.toObject(fileContent1,options);
  let jsonObj2 = csvjson.toObject(fileContent2,options);
  //console.log(jsonObj1)
  return [jsonObj1,jsonObj2];
}

function json_to_csv(horario){
  const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
  const header = Object.keys(horario[0])
  const csv = [
    header.join(';'), // header row first
    ...horario.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'))
  ].join('\r\n')

  return csv
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function get_headers(fileContent1, fileContent2){

  var allTextLines = fileContent1.split(/\r\n|\n/);
  var headers = allTextLines[0].split(';');
  return headers;
}
