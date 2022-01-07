const http = require('http');
const csvjson = require('csvjson');
const socketio = require('socket.io');
const express = require('express');
const siofu = require("socketio-file-upload");
const fs = require('fs');
const path = require('path');
const { Tabulator } = require('tabulator-tables');


const workers = []
const users = []
let old_id;
const app = express();
const server = http.createServer(app)
const io = socketio(server);
const PORT = process.env.PORT || 3000

app.use(siofu.router)
app.use(express.static('global'));
app.use(express.json());
app.set('view engine', 'ejs');
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(express.urlencoded({
	extended: true
}))

// Run when client connects
io.on('connection', socket => {

	var uploader = new siofu();
	uploader.dir = "./uploads";
	uploader.listen(socket);

	socket.emit('welcome', 'Welcome to ISCTE');

	socket.on('user', () => {
		if (this.old_id != null) {

			socket.emit('old-user-id', this.old_id)
		}
		users.push({ id: socket.id, files: {} })

		console.log("\nNew User registed with id:", socket.id, "\nUsers:", users.length)
		socket.emit('user-id', socket.id)
	})

	socket.on('worker', token => {
		if (token == 659812) {
			workers.push(socket.id)
			console.log("\nNew Worker registed with id:", socket.id, "\nWorkers:", workers.length)
			socket.to(users).emit('message', 'Worker avaible');
		}
	});

	socket.on('message', message => {

		if (message == 'send json') {

			socket.to(workers[0]).emit('message', "envia res")
		}
	});

	uploader.on("saved", function (event) {

		if (event.file.name == (socket.id + "_lectures.csv")) {
			let csv_content1 = fs.readFileSync('./uploads/' + socket.id + '_rooms.csv', { encoding: "utf8" });
			let csv_content2 = fs.readFileSync('./uploads/' + socket.id + '_lectures.csv', { encoding: "utf8" });
			var json_aux = csv_to_json(csv_content1, csv_content2);

			socket.to(workers[0]).emit('files_to_handle', { files: json_aux, id: socket.id });
			fs.unlinkSync('./uploads/' + socket.id + '_rooms.csv')
			fs.unlinkSync('./uploads/' + socket.id + '_lectures.csv')
		}

	});

	socket.on('results', body => {
		console.log(body)
		var id = JSON.parse(body).id

		var index = users.findIndex(function (user, i) {
			return user.id === id
		});
		users[index].files = JSON.parse(body).Horarios

		socket.to(id).emit('results')
	});


	socket.on('disconnect', () => {
		var val = socket.id
		var index = users.findIndex(function (user, i) {
			return user.id === val
		});

		if (index > -1) {
			//users.splice(index, 1);
			//console.log("\nUser with id",socket.id, "disconnected \nUsers:",users.length)
		} else {
			const index = workers.indexOf(socket.id);
			if (index > -1) {
				workers.splice(index, 1);
				console.log("\nWorker with id", socket.id, "disconnected \nWorkers:", workers.length)

			}
		}
	})
});

app.get('/', (req, res) => {
	res.render('index', { title: '' });
});

app.get('/success', (req, res) => {

	this.old_id = req.query.oldid;



	var id = this.old_id
	var index = users.findIndex(function (user, i) {
		return user.id === id
	});



	res.render('success', { title: 'Resultados do Horário', old_id: this.old_id, horarios: users[index].files });
})

app.post('/successcsv', (req, res) => {

	old_id = req.body.old_id
	timetable_name = req.body.name

	var id = old_id
	var index = users.findIndex(function (user, i) {
		return user.id === id
	});

	let csv

	users[index].files.forEach(horario => {

		if (horario.name == timetable_name) {
			//convert json to csv

			csv = json_to_csv(horario.lectures)

		}

	})

	res.attachment('horario.csv').send(csv)
});

app.post('/successxml', (req, res) => {

	old_id = req.body.old_id
	timetable_name = req.body.name

	var id = old_id
	var index = users.findIndex(function (user, i) {
		return user.id === id
	});

	let xml

	users[index].files.forEach(horario => {

		if (horario.name == timetable_name) {
			//convert json to xml

			xml = json_to_xml(horario.lectures)

		}

	})

	res.attachment('horario.xml').send(xml)
});

app.post('/successjson', (req, res) => {

	old_id = req.body.old_id
	timetable_name = req.body.name

	var id = old_id
	var index = users.findIndex(function (user, i) {
		return user.id === id
	});

	let json

	users[index].files.forEach(horario => {

		if (horario.name == timetable_name) {
			//convert json object to json file

			json = jsonobj_to_jsonfile(horario.lectures)

		}

	})

	res.attachment('horario.json').send(json)
});

app.post('/successhtml', (req, res) => {

	old_id = req.body.old_id
	timetable_name = req.body.name

	var id = old_id
	var index = users.findIndex(function (user, i) {
		return user.id === id
	});

	let html

	users[index].files.forEach(horario => {

		if (horario.name == timetable_name) {
			//convert json to html

			json = json_to_html(horario.lectures)

		}

	})

	res.attachment('horario.html').send(html)
});

app.post('/', (req, res) => {

	this.old_id = req.body.id

	var string = encodeURIComponent(this.old_id);
	res.redirect('/success?oldid=' + string);
	//res.redirect(302,'/success', {id: old_id} )

});

app.use((req, res) => {
	res.render('404', { title: '| 404 Error' });
});

function csv_to_json(fileContent1,fileContent2) {
	var options = {
		delimiter: ';'

	};
	let jsonObj1 = csvjson.toObject(fileContent1, options);
	let jsonObj2 = csvjson.toObject(fileContent2, options);
	;

	return [jsonObj1,jsonObj2];
}

function treatedcsv_to_json(horariocsv) {
	var options = {
		delimiter: ';'

	};
	let jsonObj = csvjson.toObject(horariocsv, options);
	;

	return [jsonObj];
}

function json_to_csv(horario) {
	const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
	const header = Object.keys(horario[0])
	const csv = [
		header.join(';'), // header row first
		...horario.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'))
	].join('\r\n')


	return csv
}

function json_to_xml(horario) {
	var xml = '';
	for (var prop in horario) {
	  xml += horario[prop] instanceof Array ? '' : "<" + prop + ">";
	  if (horario[prop] instanceof Array) {
		for (var array in horario[prop]) {
		  xml += "<" + prop + ">";
		  xml += json_to_xml(new Object(horario[prop][array]));
		  xml += "</" + prop + ">";
		}
	  } else if (typeof horario[prop] == "object") {
		xml += json_to_xml(new Object(horario[prop]));
	  } else {
		xml += horario[prop];
	  }
	  xml += horario[prop] instanceof Array ? '' : "</" + prop + ">";
	}
	var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
	return xml
  }

function jsonobj_to_jsonfile(horario) {
	const fs = require('fs');
	var file = JSON.stringify(horario);
	// mudar o nome para o id do horario
	return file
}

function json_to_html(horario){
	var table = new Tabulator("Horario",{data:horario,autoColumns:true});
	return table
}