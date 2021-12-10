const http = require('http');
const csvjson = require('csvjson');
const socketio =  require('socket.io');
const express = require('express');
const multer = require("multer");
const siofu = require("socketio-file-upload");
const formatRequest = require('./utils/request');
const fs = require('fs');


const workers = []
const users = []
const app = express();

app.use(siofu.router)

const server = http.createServer(app)
const io = socketio(server);
/*const upload = multer({ dest: "uploads/" });
const {
  userJoin,
  getCurrentUser,
  userLeave,
} = require('./utils/users');
const { get, result } = require('lodash');*/

const PORT =  process.env.PORT || 3000

app.use(express.static('global'));
app.use(express.json());

app.set('view engine', 'ejs');

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Run when client connects
io.on('connection', socket => {

  var uploader = new siofu();
  uploader.dir = "./uploads";
  uploader.listen(socket);
  //console.log('New WS connection ...');
  socket.emit('message','Welcome to ISCTE');

  socket.on('user' , ()=>{
     users.push(socket.id)
     console.log("\nNew User registed with id:",socket.id, "\nUsers:", users.length )
     socket.emit('user-id', socket.id)
  })

  socket.on('worker', token  =>{
    if (token == 659812) {
      workers.push(socket.id)
      console.log("\nNew Worker registed with id:",socket.id,"\nWorkers:",workers.length)
      socket.to(users).emit('message', 'Worker avaible');
    }
  });

  socket.on('filesSent', body =>{

      console.log("Ficheiros recebidos",body);

      socket.emit('message','Files received - Server');

      //socket.to(workers[0]).emit('files_to_handle',body);

      /*var files = fs.readdirSync('./uploads');
      console.log("Files sent:", uploader)
      var array_files = []*/
      
      
      // csv to json and send it to worker
      csv_content1 = fs.readFileSync('./uploads/'+socket.id+'_rooms', 'utf-8',);
      csv_content2 = fs.readFileSync('./uploads/'+socket.id+'_lectures', 'utf-8',);
      var json_aux = csv_to_json(csv_content1,csv_content2);
      socket.to(workers[0]).emit('files_to_handle',{files : json_aux, id: socket.id});
      console.log(json_aux[0],"\n\n",json_aux[1])


    

  });

  socket.on('disconnect', () => {
      const index = users.indexOf(socket.id) ;
      if (index > -1) {
        users.splice(index, 1);
        console.log("\nUser with id",socket.id, "disconnected \nUsers:",users.length)
      }else{
        const index = workers.indexOf(socket.id) ;
        if (index > -1) {
          workers.splice(index, 1);
          console.log("\nWorker with id",socket.id, "disconnected \nWorkers:",workers.length)

        }
      }
  })
});

app.get('/', (req,res) => {
  res.render('index', { title: ''} );
});

app.get('/success', (req,res) => {
  res.render('success', { title: 'Resultados do Horário'} );
  // um await aqui para só enviar o file quando estiver pronto
  // const file = 
  // res.download(file)
})

app.use((req, res) => {
  res.render('404', { title: '| 404 Error'} );
});

/*
app.post('/', upload.array("files"), (req,res) => {
    console.log("POST Done");
    console.log(req.body);
    console.log(req.files);
    // file está na pasta uploads e usar como fifo aka fazer um script para manipular
   
    var filenames = req.files.map(function(file) {
        return file.originalname
      });

    console.log("File names are",filenames);
    //res.redirect('/success')
});*/


function csv_to_json(fileContent1,fileContent2){

  var options = {
    delimiter : ';'
  };
  jsonObj1 = csvjson.toObject(fileContent1,options);
  jsonObj2 = csvjson.toObject(fileContent2,options);

  var jsonObjs = [jsonObj1,jsonObj2];
  return jsonObjs
}

function getFiles (){
  const files_ =  [];
  var files = fs.readdirSync("./uploads");
  for (var i in files){
      var name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()){
          getFiles(name, files_);
      } else {
          files_.push(name);
      }
  }
  return files_;
}