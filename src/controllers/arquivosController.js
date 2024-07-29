const path = require('path');
const fs = require('fs');

// Mostra todos arquivos
exports.index = (req, res) => {
  const diretorioArquivos = path.resolve(__dirname, "..", "Arquivos");

  fs.readdir(diretorioArquivos, (erro, files) => {
    if(erro) {
      res.render('paginas', {error: "Arquivos não encontrados"});
      return;
    };
    console.log(files);
    res.render("paginas", {files: files});
  });
}

// Mostra um arquivo pedido
exports.getFile = (req, res) => {
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

// Página de criação de arquivo
exports.createPage = (req, res) => {
  res.render('editor');
}

// Carrega página de edição
exports.editPage = (req, res) => {
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

// Criar postagem
exports.createFile = (req, res) => {
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
};

// Excluir postagem
exports.delete = (req, res) => {
  const titulo = req.params.titulo;
  const filePath = path.join(__dirname, '..', 'Arquivos', `${titulo}.html`);
  // Verifica se a postagem existe
  if (fs.existsSync(filePath)) {
    // Deleta o arquivo
    fs.unlink(filePath, function (err) {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao excluir arquivo');
        return;
      }
      console.log(`Post "${titulo}" excluído com sucesso`);
      res.redirect('/arquivos/');
    });
  } else {
    res.render("conteudo", {error: "Erro ao encontrar arquivo: arquivo não existe."});
  }
}
