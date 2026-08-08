import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const raiz = import.meta.dirname;

// Build multi-entrada: a raiz (`/`) é o hub que lista os cursos disponíveis,
// e cada curso vive na sua própria pasta com seu próprio index.html/entry
// point (ex: `/lua/`). Novos cursos só precisam adicionar uma entrada aqui.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/cursos-pratica/' : '/',
  // fengari (a VM Lua usada pelo curso de Lua) é uma lib pensada também para
  // Node, e alguns dos seus arquivos leem `process.env`/`process.versions`
  // assim que são carregados — coisas que existem no Node mas não no
  // navegador. Como o projeto não usa nenhum desses recursos (FENGARICONF,
  // detecção de versão do Node para io.write), é seguro trocar por valores
  // fixos e inofensivos em tempo de build, só para o carregamento do módulo
  // não quebrar no navegador.
  define: {
    'process.env': '{}',
    'process.versions': '{ node: "20.0.0" }',
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: { 'process.env': '{}', 'process.versions': '{ node: "20.0.0" }', global: 'globalThis' },
    },
  },
  resolve: {
    alias: {
      // Os `define`s acima fazem o `process` "existir" no bundle, então
      // fengari passa a tomar os mesmos caminhos de código que usaria
      // rodando em Node — inclusive os que carregam `os`, `fs`,
      // `child_process` e o pacote `tmp` assim que o módulo é importado
      // (para as bibliotecas io/os do Lua, que este projeto não usa em
      // nenhum exercício). Os stubs padrão do Vite para módulos nativos do
      // Node são objetos vazios, que quebram no primeiro método chamado —
      // por isso cada um é trocado por um stub próprio, mínimo o
      // suficiente para o carregamento não quebrar (ver comentário em cada
      // arquivo de shim).
      os: resolve(raiz, 'src/shims/os-browser.js'),
      fs: resolve(raiz, 'src/shims/fs-browser.js'),
      child_process: resolve(raiz, 'src/shims/child_process-browser.js'),
      tmp: resolve(raiz, 'src/shims/tmp-browser.js'),
      'readline-sync': resolve(raiz, 'src/shims/readline-sync-browser.js'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(raiz, 'index.html'),
        lua: resolve(raiz, 'lua/index.html'),
      },
    },
  },
});
