// Substitui o módulo `os` do Node no bundle do navegador. A única coisa que
// fengari (a VM Lua usada pelo curso de Lua) lê de `os` em tempo de
// carregamento é `platform()`, só para decidir o separador de caminho
// (`/` vs `\`) de um recurso de sistema de arquivos que este projeto nunca
// usa (io.open, require de módulo Lua em disco). Qualquer valor diferente
// de "win32" é suficiente.
module.exports = {
  platform: () => 'browser',
};
