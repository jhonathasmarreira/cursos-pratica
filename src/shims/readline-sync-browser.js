// Substitui o pacote `readline-sync` no bundle do navegador. fengari só usa
// isso para implementar debug.debug() do Lua (um REPL de depuração via
// stdin) quando roda em Node — recurso que este projeto não usa em nenhum
// exercício. O pacote real usa APIs internas do Node (`process.binding`)
// que nem existem no navegador, então precisa ser trocado por um stub.
module.exports = {
  setDefaultOptions: () => {},
  prompt: () => '',
};
