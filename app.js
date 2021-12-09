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
const upload = multer({ dest: "uploads/" });
const {
  userJoin,
  getCurrentUser,
  userLeave,
} = require('./utils/users');
const { get, result } = require('lodash');

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

      console.log("Ficheiros recebidos",body);

      socket.emit('message','Files received - Server');

      //socket.to(workers[0]).emit('files_to_handle',body);

      var files = fs.readdirSync('./uploads');
      console.log("Files sent:", files)
      var array_files = []
      let jsonObj;
      fs.readFile('./uploads/ADS - Caracterizacao das salas-8.csv', 'utf-8', (err, fileContent) => {
        if(err) {
            console.log(err); // Do something to handle the error or just throw it
            throw new Error(err);
        }

        var options = {
          delimiter : ';'
        };

        jsonObj = csvjson.toObject(fileContent,options);
        //console.log("T-----",jsonObj);

        
        
      });

    

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


function csvJSON(csv){

  csv = fs.readFileSync(csv)
  var array = csv.toString().split("\r");
  let result = [];
  let headers = array[0].split(";")

  for (let i = 1; i < array.length - 1; i++) {
    let obj = {}
    let str = array[i]
    let s = ''
   
    // By Default, we get the comma separated
    // values of a cell in quotes " " so we
    // use flag to keep track of quotes and
    // split the string accordingly
    // If we encounter opening quote (")
    // then we keep commas as it is otherwise
    // we replace them with pipe |
    // We keep adding the characters we
    // traverse to a String s
    let flag = 0
    for (let ch of str) {
      if (ch === '"' && flag === 0) {
        flag = 1
      }
      else if (ch === '"' && flag == 1) flag = 0
      if (ch === ', ' && flag === 0) ch = '|'
      if (ch !== '"') s += ch
    }
   
    // Split the string using pipe delimiter |
    // and store the values in a properties array
    let properties = s.split("|")
   
    // For each header, if the value contains
    // multiple comma separated data, then we
    // store it in the form of array otherwise
    // directly the value is stored
    for (let j in headers) {
      if (properties[j].includes(", ")) {
        obj[headers[j]] = properties[j]
          .split(", ").map(item => item.trim())
      }
      else obj[headers[j]] = properties[j]
    }
   
    // Add the generated object to our
    // result array
    result.push(obj)
  }
   
  // Convert the resultant array to json and
  // generate the JSON output file.
  let json = JSON.stringify(result);
  fs.writeFileSync('output.json', json);

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