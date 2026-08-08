// Substitui o pacote `tmp` (usado internamente pelo fengari para
// os.tmpname() do Lua) no bundle do navegador — não há sistema de arquivos
// temporário no navegador, e esse recurso não é usado em nenhum exercício.
module.exports = {
  fileSync: () => {
    throw new Error('os.tmpname não é suportado no navegador');
  },
};
