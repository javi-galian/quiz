// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next) {
	if (req.session.user) {
		var ahora = new Date().getTime();
		//console.log("  Tiempo de sesion:" + ahora + " " + JSON.stringify(req.session.user) + ' ' + (ahora - req.session.user.tiempo));
		if (ahora - req.session.user.tiempo > 120000) {	/* 120 segundos */
			req.session.errors = [{"message": 'Sesión expirada'}];
			res.redirect("/login");
			return;
		}
		req.session.user.tiempo = ahora;
		next();
	} else {
		res.redirect("/login");
	}
};

// GET /login
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

// POST /login
exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {
		if (error) {
			req.session.errors = [{"message": 'Se ha producion un error: ' + error}];
			res.redirect("/login");
			return;
		}

		req.session.user = {'id':user.id, 'username': user.username, 'tiempo': (new Date()).getTime()};
		res.redirect(req.session.redir.toString());
	});
};

// GET /logout
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect(req.session.redir.toString());
};
