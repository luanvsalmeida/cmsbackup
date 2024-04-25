var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const Usuario = require('../model/Usuario');

// Verifica se o usuário está logado
aut = function (req, res, next) {
  if (!req.session.user || !Usuario.isUser(req.session.user)) {
    console.log('error');
    res.redirect('../login');
  }
  else {
    next();
  }
}

router.use(aut);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/novo', function(req, res, next) {
  res.render('editor');
});
router.post('/salvarPostagem', (req, res) => {
    const { titulo, postagem } = req.body;
    console.log(req.body.editor);
    // Create o nome e o caminho do arquivo
    const filePath = path.join(__dirname, '..', 'Arquivos', `${titulo}.html`);

    // Escrevendo o arquivo
    fs.writeFile(filePath, postagem, err => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to save post' });
        } else {
            console.log(`Post "${titulo}" saved successfully`);
            res.redirect('/');
        }
    });
});

module.exports = router;