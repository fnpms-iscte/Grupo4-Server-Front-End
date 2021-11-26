const express = require('express');

const app = express();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const port =  process.env.port || 3000

app.use(express.static('global'));
app.use(express.json());

app.set('view engine', 'ejs');

app.listen(port, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port: ", port);
})

app.get('/', (req,res) => {
    res.render('index', { title: ''} );
});

app.get('/resultados', (req,res) => {
    console.log(req)
    res.render('index', { title: '| Resultados'} );
});

app.post('/', upload.array("files"), (req,res) => {
    console.log("Tentei fazer post");
    console.log(req.body);
    //console.log(req.files);
    console.log(req.files);
    res.json({ message: "Successfully uploaded files" });
});

app.use((req, res) => {
    res.render('404', { title: '| 404 Error'} );
});
