var express = require('express');
var router = express.Router();
const Usuario = require('../model/Usuario');
const LoginValidator = require('../validator/LoginValidator');
const path = require('path');
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  const {error, value} = {};
  res.render('login', {error, value});
});

router.post('/login', function(req, res, next) {
  const {error, value} = LoginValidator.validate(req.body);
  console.log('usuario: ' + value.usuario + ' senha: ' + value.senha);
  if (error) {
    res.render('login', {error: error.details[0].message, value: req.body});
  }
  else {
    // Checando dados do usuário
    if (Usuario.isUser(value)) {
      req.session.user = value;
      res.redirect('/');
    } 
    else {
        res.render('login', {error: 'Invalid username or password', value: req.body});
    }
  }
});

//Renderiza a página com os arquivos já criados disponíveis
router.get('/arquivos', (req, res) => {

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

//Renderiza conteudo de arquivos
router.get("/arquivos/:file", (req, res) => {
  const { file } = req.params;
  console.log(file);
  const dirPath = path.resolve(__dirname, "..", "Arquivos");
  const filePath = path.join(dirPath, file);

  if(!fs.existsSync(filePath)){
    res.render("conteudo", {error: "Erro ao encontrar arquivo: arquivo não existe."});
    return;
  };

  //Renderiza o conteúdo do arquivo na página de edição
    fs.readFile(filePath, 'utf-8', (erro, data) => {
      if (erro) {
        console.error('Erro ao ler o arquivo:', erro);
        res.status(500).send('Erro interno do servidor');
        return;
      }
      return res.render("editor", {titulo: file.replace(".html", ""), conteudo: data});
    });
  }
);

router.get("/conteudo/:file", (req, res) => {
  const { file } = req.params;
  console.log(file);
  const dirPath = path.resolve(__dirname, "..", "Arquivos");
  const filePath = path.join(dirPath, file);

  if(!fs.existsSync(filePath)){
    res.render("conteudo", {error: "Erro ao encontrar arquivo: arquivo não existe."});
    return;
  };

  //Renderiza o conteúdo do arquivo na página de edição
    fs.readFile(filePath, 'utf-8', (erro, data) => {
      if (erro) {
        console.error('Erro ao ler o arquivo:', erro);
        res.status(500).send('Erro interno do servidor');
        return;
      }
      return res.render("conteudo", {titulo: file.replace(".html", ""), conteudo: data});
    });
  }
);
module.exports = router;
