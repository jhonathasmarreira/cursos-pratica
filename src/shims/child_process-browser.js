// Substitui `child_process` no bundle do navegador: fengari só usa isso
// para os.execute() do Lua, que não é usado em nenhum exercício. Só
// precisa não quebrar o carregamento do módulo.
module.exports = {
  execSync: () => {
    throw new Error('os.execute não é suportado no navegador');
  },
};
