var express = require('express');
var router = express.Router();

var quizController = require("../controllers/quiz_controller");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', 'mensaje': 'El portal donde podrá crear sus propios juegos' });
});
router.get('/author', quizController.author);
router.get("/quizes/question", quizController.question);
router.get("/quizes/answer", quizController.answer);

module.exports = router;
