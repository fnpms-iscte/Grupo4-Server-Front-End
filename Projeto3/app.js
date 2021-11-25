const express = require('express');

const app = express();

const port =  process.env.port || 3000

app.use(express.static('global'));

app.set('view engine', 'ejs');
app.listen(port)

app.get('/', (req,res) => {
    res.render('index', { title: ''} );
});

app.get('/resultados', (req,res) => {
    console.log(req)
    res.render('index', { title: '| Resultados'} );
});

/*app.post('/teste', (req,res)=>{
    console.log(req.body.rooms)

});*/

app.use((req, res) => {
    res.render('404', { title: '| 404 Error'} );
});
