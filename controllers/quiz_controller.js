var models = require("../models/models.js");

// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz
	.find({'where': {'id': Number(quizId)}})
	.then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe quizId=' + quizId))
		}
    }).catch(function(error) { next(error) });
};

// GET /quizes/question
exports.question = function(req, res) {
	models.Quiz.findAll().then(function(quiz) {
		res.render("quizes/question", {'pregunta': quiz[0].pregunta});
	})
};

// GET /author

exports.author = function(req, res) {
	res.render("quizes/author", {errors: []});
};

// GET /quizes/:id

exports.show = function(req, res) {
	res.render('quizes/show', {'quiz': req.quiz, errors: []});
};

// GET /quizes
exports.index = function(req, res) {
	var options = {'order': [['pregunta', 'ASC']]};
	if (req.query.search){
		options.where = ["pregunta like ?", '%' + req.query.search.replace(' ','%') + '%']
	}
	models.Quiz.findAll(options).then(
		function(quizes) {
			res.render('quizes/index.ejs', {'quizes': quizes, 'search': req.query.search, errors: []});
		}
	).catch(function(error) { 
		//console.log("Error:"+error) 
		next(error);
	})
};

// GET /quizes/answer

exports.answer = function(req, res) {
	var resultado;
	if (req.query.respuesta.trim() === req.quiz.respuesta) {
		resultado = 'Correcto';
	} else {
		resultado = 'Incorrecto';
	}
	res.render("quizes/answer", {'quiz': req.quiz, 'respuesta': resultado, errors: []});
};

// GET /quizes/new

exports.new = function(req, res) {
	var quiz = models.Quiz.build(
		{'pregunta': "Pregunta", 'respuesta': "Respuesta", "tema":"otro"}
	);
	res.render("quizes/new", {'quiz': quiz, errors: []});
};

// GET /quizes/create

exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	
	quiz.validate()
		.then(
			function(err) {
				if (err) {
					res.render('quizes/new', {quiz: quiz, errors: err.errors});
				} else {
					quiz.save({'fields': ["pregunta", "respuesta", "tema"]})
						.then(function() {
							res.redirect("/quizes");
						})
				}
			})
};

exports.edit = function(req, res) {
	var quiz = req.quiz;
	
	res.render("quizes/edit", {quiz: quiz, errors: []});
};

exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	
	req.quiz.validate()
	.then(
		function(err) {
			if (err) {
				res.render("quizes/edit", {quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz
					.save({fields: ["pregunta", "respuesta", "tema"]})
					.then(function() { res.redirect("/quizes"); });
			}
		}
	);
};

// DELETE /quizes/:id

exports.destroy = function(req, res) {
	req.quiz.destroy().then(function() {
		res.redirect("/quizes");
	}).catch(function(error) { next(error); });
};
