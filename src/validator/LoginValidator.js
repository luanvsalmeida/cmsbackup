const Joi = require('joi');

const LoginSchema = Joi.object({
    usuario: Joi.string()
        .min(3)
        .max(30),
    senha: Joi.string()
        .min(3)
        .max(30)
}).with('usuario', 'senha');

module.exports = LoginSchema;