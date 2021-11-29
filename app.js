const http = require('http');
const socketio =  require('socket.io');
const express = require('express');
const multer = require("multer");
const formatRequest = require('./utils/request');

const app = express();
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
    console.log('New WS connection ...');
    socket.emit('message','Welcome to ISCTE');
});

/*app.listen(port, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port: ", port);
})*/

app.get('/', (req,res) => {
  res.render('index', { title: ''} );
});
/*
app.get('/success', (req,res) => {
    res.render('success', { title: 'Resultados do Horário'} );
    // um await aqui para só enviar o file quando estiver pronto
    // const file = 
    // res.download(file)
  })
  */
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

/*app.use((req, res) => {
    res.render('404', { title: '| 404 Error'} );
});*/


