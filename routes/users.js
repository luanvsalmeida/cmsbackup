var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/novo', function(req, res, next) {
  res.render('editor');
});
// ainda falta resolver o problema ao tentar resgatar o conteudo detro do editor de texto
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