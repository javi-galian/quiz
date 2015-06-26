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
	res.render("quizes/author", {});
};

// GET /quizes/:id

exports.show = function(req, res) {
	res.render('quizes/show', {'quiz': req.quiz});
};

// GET /quizes
exports.index = function(req, res) {
	var options = {'order': [['pregunta', 'ASC']]};
	if (req.query.search){
		options.where = ["pregunta like ?", '%' + req.query.search.replace(' ','%') + '%']
	}
	models.Quiz.findAll(options).then(
		function(quizes) {
			res.render('quizes/index', {'quizes': quizes});
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
	res.render("quizes/answer", {'quiz': req.quiz, 'respuesta': resultado});
};

