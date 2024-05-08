var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const Usuario = require('../model/Usuario');
const acesso = require('../helpers/acesso');

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

router.use(acesso.autentica);

// Página inicial do usuário ainda não implementada
router.get('/', function(req, res, next) {
  const diretorioArquivos = path.resolve(__dirname, "..", "Arquivos");

  fs.readdir(diretorioArquivos, (erro, files) => {
    if(erro) {
      res.render('paginas', {error: "Arquivos não encontrados"});
      return;
    };
    console.log(files);
    res.render("paginas", {files: files});
  });
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

//Página para excluir postagem
router.get('/excluir', function(req, res) {
  const titulo = req.query.titulo;

  console.log(titulo);
  const filePath = path.join(__dirname, '..', 'Arquivos', `${titulo}.html`);
  //Deleta a postagem
  fs.unlink(filePath, function (err) {
    if (err) 
      throw err;
  });
  res.redirect('/');
})

module.exports = router;