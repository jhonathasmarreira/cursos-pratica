// Substitui o módulo `fs` do Node no bundle do navegador. fengari só usa
// isso para as funções de I/O de arquivo do Lua (io.open, os.remove, etc.),
// que este projeto não expõe/usa em nenhum dos exercícios — então basta
// evitar que o carregamento do módulo quebre; se alguma dessas funções
// chegar a ser chamada de verdade, o erro é claro em vez de um crash.
function naoSuportado() {
  throw new Error('operação de arquivo não suportada no navegador');
}

module.exports = {
  constants: { O_CREAT: 0, O_TRUNC: 0, O_EXCL: 0, O_RDWR: 0, O_WRONLY: 0, O_RDONLY: 0 },
  writeSync: naoSuportado,
  readSync: naoSuportado,
  openSync: naoSuportado,
  closeSync: () => {},
  existsSync: () => false,
  unlinkSync: naoSuportado,
  rmdirSync: naoSuportado,
  renameSync: naoSuportado,
};
