const http = require('http');
const socketio =  require('socket.io');
const express = require('express');
const multer = require("multer");
const siofu = require("socketio-file-upload");
const formatRequest = require('./utils/request');

const workers = []
const users = []
const app = express();

app.use(siofu.router)

const server = http.createServer(app)
const io = socketio(server);
const upload = multer({ dest: "uploads/" });
const {
  userJoin,
  getCurrentUser,
  userLeave,
} = require('./utils/users');

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
  })

  socket.on('worker', token  =>{
    if (token == 659812) {
      workers.push(socket.id)
      console.log("\nNew Worker registed with id:",socket.id,"\nWorkers:",workers.length)
      socket.to(users).emit('message', 'Worker avaible');
    }



  });

  socket.on('filesSent', body =>{

      console.log("Ficheiros recebidos",body.files);

      socket.emit('message','Files received - Server');

      socket.to(workers[0]).emit('files_to_handle',body);
  });

  socket.on('disconnect', () => {
      const index = users.indexOf(socket.id) ;
      if (index > -1) {
        users.splice(index, 1);
        console.log("\nUser disconnected \nUsers:",users.length)
      }else{
        const index = workers.indexOf(socket.id) ;
        if (index > -1) {
          workers.splice(index, 1);
          console.log("\nWorker disconnected \nWorkers:",workers.length)

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