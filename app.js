const http = require('http');
const csvjson = require('csvjson');
const socketio =  require('socket.io');
const express = require('express');
const siofu = require("socketio-file-upload");
const fs = require('fs');


const workers = []
const users = []
const app = express();
const server = http.createServer(app)
const io = socketio(server);
const PORT =  process.env.PORT || 3000

app.use(siofu.router)
app.use(express.static('global'));
app.use(express.json());
app.set('view engine', 'ejs');
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Run when client connects
io.on('connection', socket => {

  var uploader = new siofu();
  uploader.dir = "./uploads";
  uploader.listen(socket);
  
  socket.emit('welcome','Welcome to ISCTE');

  socket.on('user' , ()=>{
     users.push({id : socket.id, files : {}})
     
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

  socket.on('message', message=> {
    console.log(message)

    if (message == 'send json') {
      console.log("hi there")
      socket.to(workers[0]).emit('message', "envia res")
    }
  });

  uploader.on("saved", function(event){
    console.log(event.file.name, "Uploaded")
    if(event.file.name == (socket.id+"_lectures")){
      let csv_content1 = fs.readFileSync('./uploads/'+socket.id+'_rooms', 'utf-8',);
      let csv_content2 = fs.readFileSync('./uploads/'+socket.id+'_lectures', 'utf-8',);
      var json_aux = csv_to_json(csv_content1,csv_content2);
      socket.to(workers[0]).emit('files_to_handle',{files : json_aux, id: socket.id});
      fs.unlinkSync('./uploads/'+socket.id+'_rooms')
      fs.unlinkSync('./uploads/'+socket.id+'_lectures')
    }
    
  });

  socket.on('filesSent', body =>{
    // Para APAGAR ???     
  });

  socket.on('results', body =>{
    var val = JSON.parse(body).id_client
    var index = users.findIndex(function(user, i){
      return user.id === val
    });
    users[index].files = JSON.parse(body).horarios

    socket.to(val).emit('results',val)
  });
  

  socket.on('disconnect', () => {
      var val = socket.id
      var index = users.findIndex(function(user, i){
        return user.id === val
      });

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


app.post('/',  (req,res) => {
    console.log("POST Done");
    console.log(req);
    // file está na pasta uploads e usar como fifo aka fazer um script para manipular
   
    //var filenames = req.files.map(function(file) {
    //    return file.originalname
     // });
    //res.redirect('/success')
});/**/


function csv_to_json(fileContent1, fileContent2){

  var options = {
    delimiter : ';'
  };
  let jsonObj1 = csvjson.toObject(fileContent1,options);
  let jsonObj2 = csvjson.toObject(fileContent2,options);
  return [jsonObj1,jsonObj2];
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