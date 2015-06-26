var path = require("path");

// Postgres DATABASE_URL postgres://akkawylkecwgvw:9-p3EMEX-1p1f0YxVt3vg9mnW_@ec2-54-83-18-87.compute-1.amazonaws.com:5432/d8epp3n6eepd8l
// SQLite   DATABASE_URL = sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require("sequelize");


// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

exports.Quiz = Quiz;

sequelize.sync().then(function() {
	Quiz.count().then(function (count) {
		console.log("La base de datos tiene " + count + " registros");
		if (count === 0) {
			Quiz.create({"pregunta": "Capital de Italia", "respuesta":"Roma"});
			Quiz.create({"pregunta": "Capital de Portugal", "respuesta":"Lisboa"})
				.then(function() {
					console.log('Base de datos inicializada');
				});
		};
	});
});
