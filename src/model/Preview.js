const path = require('path');
const fs = require('fs');

module.exports = {
    getPreviews: function getPreviews() {
        const dirPosts = path.resolve(__dirname, "..", "Arquivos");
        const arqPosts = fs.readdirSync(dirPosts);
        return arqPosts.map(arquivo => {
            const pathArq = path.join(dirPosts, arquivo);
            const conteudo = fs.readFileSync(pathArq, 'utf-8');
            preview = conteudo.split('\n').slice(0, 3). join(' ');
            const stats = fs.statSync(pathArq);
            return {
                titulo: arquivo.replace('.html', ''),
                preview,
                nomeArq: arquivo,
                data: stats.mtime
            };
        });
    },

    ordenar: function ordenar(previews, opcao) {
        switch (opcao) {
            case 'data':
                return previews.sort((a, b) => new Date(a.data) - new Date(b.data));
            case 'titulo':
                return previews.sort((a, b) => a.titulo.localeCompare(b.titulo));
            default:
                return previews;
        }
    }
    
    
}