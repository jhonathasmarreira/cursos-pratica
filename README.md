# Cursos & Prática

Espaço pessoal de estudo e prática. Segue o mesmo modelo do projeto
[`avaliacao`](https://github.com/jhonathasmarreira/avaliacao) (React + TypeScript
+ Vite, sem backend/banco de dados, tudo rodando dentro da própria aplicação
web) — mas aqui não é uma prova para candidato: é uma ferramenta de estudo
pessoal, sem identificação, sem envio de e-mail e sem relatório para
terceiros. Cada curso é um mini-app independente com exercícios corrigidos
automaticamente, na medida em que for aprendendo assuntos novos.

## Como funciona

A raiz (`/`) é um hub simples que lista os cursos disponíveis. Cada curso
vive na sua própria pasta, com seu próprio entry point HTML e seu próprio
bundle (igual ao `avaliacao`, que separava `/cypress-test` de
`/cucumber-test`) — assim um curso não interfere no outro, e novos cursos só
precisam adicionar uma entrada nova.

- Dev: `http://localhost:5173/`
- Produção: `https://SEU_USUARIO.github.io/cursos-pratica/`

## Curso disponível: Lua — Fundamentos (`/lua`)

9 exercícios cobrindo a base da linguagem: variáveis e tipos, operadores e
concatenação de strings, condicionais, laços, tabelas (como array e como
dicionário), funções com retorno múltiplo, closures e tratamento de erros
com `pcall`.

Cada exercício tem: uma explicação teórica do conceito, um enunciado do que
implementar, uma dica opcional, e um editor de código (CodeMirror, com
destaque de sintaxe Lua) já com um código inicial que **sempre reprova** —
ou porque imprime algo propositalmente errado, ou porque a função cai num
`error(...)` — é o sinal de "exercício pendente". Você apaga isso e escreve
a solução por baixo.

O diferencial em relação ao `avaliacao`: o código não roda contra uma
reimplementação simplificada de uma API (como o mini-Cypress ou o
mini-Selenium de lá) — ele roda em uma **VM Lua real**, via a biblioteca
[Fengari](https://fengari.io/) (Lua 5.3 implementado em JavaScript,
executando inteiramente no navegador, sem servidor). Ou seja: é Lua de
verdade, com a sintaxe e o comportamento reais da linguagem.

A correção acontece de duas formas, dependendo do exercício:

- **Por saída** (`tipo: 'saida'`): o motor troca o `print` global do Lua por
  uma função que guarda cada linha impressa, e compara o resultado, linha a
  linha, com a saída esperada.
- **Por função** (`tipo: 'funcao'`): o motor carrega o script do aluno e
  depois chama, de fora, a função que o enunciado pediu para definir, com
  vários casos de teste (entradas diferentes), comparando o retorno de cada
  chamada com o valor esperado.

Como não há sistema sob teste nem servidor, não existe o mesmo risco de
travar numa espera de rede — mas um loop infinito no código do aluno ainda
seria um problema, então o motor usa um hook de instrução do próprio Lua
(`lua_sethook`) para abortar a execução automaticamente se ela passar de 3
segundos.

O progresso (código escrito e resultado de cada exercício) fica salvo no
`localStorage` do navegador — diferente do simulador de avaliação, que
nunca persiste de propósito (lá cada prova deve começar do zero). Aqui é o
oposto: é para você poder fechar a aba e continuar de onde parou. Há um
botão para reiniciar o progresso do zero, se quiser.

## Comandos

```
npm install
npm run dev        # http://localhost:5173 — desenvolvimento
npm run build       # gera dist/ (build de produção)
npm run preview     # serve o build gerado
```

### Sobre o `vite.config.ts` do curso de Lua

Fengari é pensada para rodar tanto em Node quanto no navegador, e alguns
arquivos dela fazem checagens do tipo `typeof process === "undefined"` para
decidir qual dos dois ambientes está em uso. Para o `process.env.FENGARICONF`
lido logo na carga do módulo não quebrar no navegador (onde `process` nem
existe), o `vite.config.ts` define valores fixos para `process.env` e
`process.versions` — só que isso tem o efeito colateral de fazer `process`
"existir" no bundle inteiro, então todas aquelas checagens passam a achar
que está rodando em Node, e tentam carregar `os`, `fs`, `child_process` e os
pacotes `tmp`/`readline-sync` (usados só pelas partes de I/O de arquivo e
REPL de depuração do Lua, que este curso não usa). Por isso `resolve.alias`
troca cada um desses por um stub mínimo em `src/shims/`, só para o
carregamento do módulo não quebrar — nenhum exercício do curso depende de
I/O de arquivo, então isso não limita nada do que é ensinado.

## Estrutura

```
index.html, src/main.tsx, src/App.tsx    hub — lista os cursos disponíveis
src/index.css                             estilos compartilhados entre hub e cursos

lua/index.html, src/lua-main.tsx          entry point do curso de Lua
src/lua/
  exercicios.ts               os 9 exercícios (teoria + enunciado + dica + código inicial + verificação)
  engine/runner.ts            executa o código Lua do aluno numa VM Lua real (Fengari) e confere o resultado
  store/useLuaStore.ts        progresso do curso, persistido em localStorage
  components/, pages/         telas do curso (lista de exercícios, editor, resultado, resumo da sessão)

.github/workflows/deploy.yml  CI: builda e publica no GitHub Pages (sem testes, sem envio de e-mail)
```

## Limitações conhecidas

- O código do aluno roda sem sandbox de segurança forte (é uma ferramenta de
  estudo pessoal, sem dados sensíveis de terceiros em risco).
- Um loop infinito no código do aluno é interrompido automaticamente após 3
  segundos pelo motor (ver `src/lua/engine/runner.ts`), mas ainda assim
  trava a aba por esse tempo.
- Casos de teste só aceitam number, string, boolean, nil e arrays (tabelas
  sequenciais) como argumento/retorno — tabelas com chaves string
  (dicionários) só são suportadas como estrutura interna dentro do próprio
  código do aluno, não como entrada/saída verificada automaticamente.
