const Usuario = require('../model/Usuario');

// Verifica se o usuário está logado
module.exports = {
    autentica: function (req, res, next) {
        if (!req.session.user || !Usuario.isUser(req.session.user)) {
            res.redirect('/login');
        }
        else {
            next();
        }
    },
    estaLogado: function (req, res, next) {
        if (!req.session.user || !Usuario.isUser(req.session.user)) {
            req.session.logado = false;
        }
        else {
            req.session.logado = true;
        }
        next();
    }     
}