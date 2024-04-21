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

  if (error) {
    res.render('login', {error: error.details[0].message, value: req.body});
  }
  else {
    // Checando dados do usuário
    if (Usuario.isUser(req.body)) {
      req.session.authenticated = true;
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

//Renderiza conteudo de arquivos txt e html
router.get("/arquivos/:file", (req, res) => {
  const { file } = req.params;
  const dirPath = path.resolve(__dirname, "..", "Arquivos");
  const filePath = path.join(dirPath, file);

  if(!fs.existsSync(filePath)){
    res.render("conteudo", {error: "Erro ao encontrar arquivo: arquivo não existe."});
    return;
  };

  //Renderiza o conteúdo do arquivo txt na página conteúdo
  if (file.endsWith('.txt')) {
    fs.readFile(filePath, 'utf-8', (erro, data) => {
      if (erro) {
        console.error('Erro ao ler o arquivo:', erro);
        res.status(500).send('Erro interno do servidor');
        return;
      }
      res.render("conteudo", {data: data});
      return;
    });
  } else if(file.endsWith('.html')) {
    //Carrega página HTML
    res.sendFile(filePath);
  } else {                    
    //Arquivo não pode ser renderizado                 
    res.render('conteudo', {error: "O arquivo não pode ser renderizado. Formato não suportado."});
    return;
  }

});
module.exports = router;
