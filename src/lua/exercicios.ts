import type { Exercicio } from './types';

// Os 9 exercícios do curso, em ordem crescente de dificuldade. Cada um tem:
// - teoria: explicação do conceito de Lua, pensada para quem nunca viu a
//   linguagem (mas já programa em outra);
// - enunciado: o que o código precisa fazer, de forma objetiva;
// - codigoInicial: sempre reprova como está — ou porque imprime um texto
//   errado de propósito, ou porque a função cai num `error(...)` — igual à
//   convenção do simulador de Cypress/Cucumber do projeto "avaliacao": o
//   aluno apaga o "pendente" e escreve a solução por baixo;
// - verificacao: como o motor (src/lua/engine/runner.ts) decide se passou.
//   `tipo: 'saida'` compara linha a linha o que o script imprime com
//   `print()`. `tipo: 'funcao'` chama, de fora, uma função que o enunciado
//   pede pra você definir, com vários casos de teste, e compara o retorno.

function pendente(mensagem: string): string {
  return `error("${mensagem}")`;
}

export const EXERCICIOS: Exercicio[] = [
  {
    numero: 1,
    titulo: 'Variáveis e tipos',
    teoria: [
      'Lua é uma linguagem dinamicamente tipada: você não declara o tipo de uma variável, ele é ' +
        'decidido pelo valor que ela guarda. Os tipos básicos são nil, boolean, number, string, ' +
        'table e function.',
      'Variáveis são globais por padrão — o que costuma ser indesejado. Use sempre a palavra-chave ' +
        'local para criar uma variável local ao bloco/arquivo atual: local nome = "Ada".',
      'A função print(...) aceita vários argumentos e imprime cada um separado por tabulação, ' +
        'seguido de uma quebra de linha.',
    ],
    enunciado:
      'Escreva um script que declare três variáveis locais — uma string, um number e um boolean — ' +
      'com os valores "Ada", 36 e true (nessa ordem), e imprima cada uma em uma linha separada, ' +
      'usando um print() por variável.',
    dica: 'local nome = "Ada"\nprint(nome)\n-- repita o padrão para as outras duas variáveis',
    codigoInicial: `-- TODO: declare as variáveis e troque os prints abaixo pelos delas\nprint("implemente aqui")`,
    verificacao: { tipo: 'saida', esperado: ['Ada', '36', 'true'] },
  },

  {
    numero: 2,
    titulo: 'Operadores e concatenação de strings',
    teoria: [
      'Lua usa os operadores aritméticos usuais (+, -, *, /, %, ^) e o operador .. para concatenar ' +
        'strings (não é +). Concatenar um número com uma string converte o número automaticamente.',
      'O operador # na frente de uma string retorna o número de caracteres: #"Maria" é 5.',
    ],
    enunciado:
      'Dadas as variáveis locais nome = "Maria" e sobrenome = "Silva", imprima exatamente a frase ' +
      '"Maria Silva tem 5 letras no primeiro nome", montando o texto com concatenação (..) e usando ' +
      '#nome para obter o número 5 (não escreva o número 5 direto no texto).',
    dica: 'print(nome .. " " .. sobrenome .. " tem " .. #nome .. " letras no primeiro nome")',
    codigoInicial: `local nome = "Maria"\nlocal sobrenome = "Silva"\n-- TODO: monte e imprima a frase usando concatenação\nprint("implemente aqui")`,
    verificacao: { tipo: 'saida', esperado: ['Maria Silva tem 5 letras no primeiro nome'] },
  },

  {
    numero: 3,
    titulo: 'Condicionais (if / elseif / else)',
    teoria: [
      'A estrutura condicional em Lua é if <condição> then ... elseif <condição> then ... else ... end.',
      'Em Lua, só nil e false são valores "falsos"; qualquer outra coisa (incluindo 0 e "") é ' +
        'considerada verdadeira dentro de um if.',
      'Os operadores de comparação são ==, ~= (diferente de, não !=), <, >, <=, >=, e os lógicos são ' +
        'and, or e not (por extenso, não &&/||/!).',
    ],
    enunciado:
      'Implemente a função classificarIdade(idade), que retorna uma string: "crianca" para idade ' +
      'menor que 12, "adolescente" para idade entre 12 (inclusive) e 18 (exclusive), "adulto" para ' +
      'idade entre 18 (inclusive) e 60 (exclusive), e "idoso" para 60 ou mais.',
    dica: 'if idade < 12 then\n  return "crianca"\nelseif idade < 18 then\n  ...\nend',
    codigoInicial: `function classificarIdade(idade)\n  ${pendente('implemente classificarIdade')}\nend`,
    verificacao: {
      tipo: 'funcao',
      nome: 'classificarIdade',
      casos: [
        { args: [5], esperado: 'crianca', descricao: 'classificarIdade(5)' },
        { args: [15], esperado: 'adolescente', descricao: 'classificarIdade(15)' },
        { args: [30], esperado: 'adulto', descricao: 'classificarIdade(30)' },
        { args: [70], esperado: 'idoso', descricao: 'classificarIdade(70)' },
        { args: [12], esperado: 'adolescente', descricao: 'classificarIdade(12) — limite inclusive' },
        { args: [60], esperado: 'idoso', descricao: 'classificarIdade(60) — limite inclusive' },
      ],
    },
  },

  {
    numero: 4,
    titulo: 'Laço for numérico',
    teoria: [
      'O for numérico tem a forma for i = inicio, fim, passo do ... end (o passo é opcional, o ' +
        'padrão é 1). O laço inclui tanto o início quanto o fim.',
      'Um padrão comum é o acumulador: uma variável local criada antes do laço, que vai sendo ' +
        'atualizada a cada volta (local soma = 0; for i = 1, n do soma = soma + i end).',
    ],
    enunciado:
      'Implemente a função somaAte(n), que retorna a soma de todos os inteiros de 1 até n (inclusive), ' +
      'usando um for numérico e uma variável acumuladora — não use a fórmula de Gauss direto.',
    dica: 'local soma = 0\nfor i = 1, n do\n  soma = soma + i\nend\nreturn soma',
    codigoInicial: `function somaAte(n)\n  ${pendente('implemente somaAte')}\nend`,
    verificacao: {
      tipo: 'funcao',
      nome: 'somaAte',
      casos: [
        { args: [1], esperado: 1, descricao: 'somaAte(1)' },
        { args: [5], esperado: 15, descricao: 'somaAte(5)' },
        { args: [10], esperado: 55, descricao: 'somaAte(10)' },
        { args: [100], esperado: 5050, descricao: 'somaAte(100)' },
      ],
    },
  },

  {
    numero: 5,
    titulo: 'Tabelas como array e ipairs',
    teoria: [
      'Tabelas são a única estrutura de dados composta em Lua, mas servem tanto de array quanto de ' +
        'dicionário. Um array é só uma tabela cujas chaves são números inteiros sequenciais ' +
        'começando em 1: local t = {10, 20, 30} equivale a t[1]=10, t[2]=20, t[3]=30.',
      'ipairs(t) percorre a tabela em ordem, do índice 1 até o primeiro buraco, entregando índice e ' +
        'valor a cada volta: for i, v in ipairs(t) do ... end. table.insert(t, valor) adiciona um ' +
        'elemento ao final.',
    ],
    enunciado:
      'Implemente a função filtrarPares(lista), que recebe um array de números e retorna um novo ' +
      'array só com os valores pares, na mesma ordem em que aparecem na lista original.',
    dica:
      'local resultado = {}\nfor _, v in ipairs(lista) do\n  if v % 2 == 0 then\n    table.insert(resultado, v)\n  end\nend',
    codigoInicial: `function filtrarPares(lista)\n  ${pendente('implemente filtrarPares')}\nend`,
    verificacao: {
      tipo: 'funcao',
      nome: 'filtrarPares',
      casos: [
        { args: [[1, 2, 3, 4, 5, 6]], esperado: [2, 4, 6], descricao: 'filtrarPares({1,2,3,4,5,6})' },
        { args: [[1, 3, 5]], esperado: [], descricao: 'filtrarPares({1,3,5}) — nenhum par' },
        { args: [[2, 4]], esperado: [2, 4], descricao: 'filtrarPares({2,4}) — todos pares' },
        { args: [[]], esperado: [], descricao: 'filtrarPares({}) — lista vazia' },
      ],
    },
  },

  {
    numero: 6,
    titulo: 'Tabelas como dicionário',
    teoria: [
      'A mesma tabela também funciona como dicionário (mapa chave → valor), usando chaves que não ' +
        'precisam ser números sequenciais: local t = { number = 0, string = 0 }. t.number e ' +
        't["number"] acessam a mesma coisa — a sintaxe com ponto é só açúcar sintático.',
      'A função type(v) retorna, como string, o tipo de qualquer valor Lua: "number", "string", ' +
        '"boolean", "table", "function", "nil".',
    ],
    enunciado:
      'Implemente a função contarPorTipo(lista), que recebe um array com valores misturados ' +
      '(números e strings) e usa uma tabela local como dicionário (com chaves "number" e "string") ' +
      'para contar quantos itens de cada tipo existem. A função deve retornar um array de 2 números: ' +
      '{ quantidade_de_numbers, quantidade_de_strings }.',
    dica:
      'local contagem = { number = 0, string = 0 }\nfor _, v in ipairs(lista) do\n  contagem[type(v)] = contagem[type(v)] + 1\nend\nreturn { contagem.number, contagem.string }',
    codigoInicial: `function contarPorTipo(lista)\n  ${pendente('implemente contarPorTipo')}\nend`,
    verificacao: {
      tipo: 'funcao',
      nome: 'contarPorTipo',
      casos: [
        { args: [[1, 2, 'a']], esperado: [2, 1], descricao: "contarPorTipo({1, 2, 'a'})" },
        { args: [['x', 'y', 'z']], esperado: [0, 3], descricao: "contarPorTipo({'x','y','z'})" },
        { args: [[1, 2, 3]], esperado: [3, 0], descricao: 'contarPorTipo({1,2,3})' },
      ],
    },
  },

  {
    numero: 7,
    titulo: 'Funções e retorno múltiplo',
    teoria: [
      'Funções Lua podem retornar mais de um valor de uma vez, separados por vírgula: return menor, ' +
        'maior. Quem chama a função pode capturar todos: local a, b = minMax(lista).',
      'Um idioma comum para "parâmetro opcional com valor padrão" é parametro = parametro or ' +
        'valorPadrao logo no início da função, já que parâmetros não passados chegam como nil.',
    ],
    enunciado:
      'Implemente a função minMax(lista), que recebe um array de números (com pelo menos um ' +
      'elemento) e retorna dois valores: o menor e o maior número da lista, nessa ordem.',
    dica:
      'local menor, maior = lista[1], lista[1]\nfor _, v in ipairs(lista) do\n  if v < menor then menor = v end\n  if v > maior then maior = v end\nend\nreturn menor, maior',
    codigoInicial: `function minMax(lista)\n  ${pendente('implemente minMax')}\nend`,
    verificacao: {
      tipo: 'funcao',
      nome: 'minMax',
      nresultados: 2,
      casos: [
        { args: [[3, 1, 4, 1, 5, 9, 2, 6]], esperado: [1, 9], descricao: 'minMax({3,1,4,1,5,9,2,6})' },
        { args: [[7]], esperado: [7, 7], descricao: 'minMax({7}) — um único elemento' },
        { args: [[-2, -5, 0]], esperado: [-5, 0], descricao: 'minMax({-2,-5,0}) — negativos' },
      ],
    },
  },

  {
    numero: 8,
    titulo: 'Escopo e closures',
    teoria: [
      'Uma função em Lua "enxerga" as variáveis locais dos blocos em que foi definida, mesmo depois ' +
        'que esses blocos terminarem de executar — isso é uma closure. É assim que se cria estado ' +
        'privado sem usar variável global.',
      'Um padrão clássico é uma "função fábrica": uma função que, ao ser chamada, cria uma variável ' +
        'local e retorna uma nova função que lê/altera essa variável a cada chamada.',
    ],
    enunciado:
      'Escreva uma função local criarContador() que retorna uma função. Cada vez que a função ' +
      'retornada é chamada, ela deve devolver um número que começa em 1 e aumenta 1 a cada chamada ' +
      '(a primeira chamada retorna 1, a segunda 2, e assim por diante). No script, crie um contador ' +
      'com criarContador() e chame-o 3 vezes, imprimindo (com print) o resultado de cada chamada, ' +
      'uma por linha.',
    dica:
      'function criarContador()\n  local n = 0\n  return function()\n    n = n + 1\n    return n\n  end\nend\n\nlocal contador = criarContador()\nprint(contador())',
    codigoInicial: `-- TODO: defina criarContador, crie um contador e chame-o 3 vezes\nprint("implemente aqui")`,
    verificacao: { tipo: 'saida', esperado: ['1', '2', '3'] },
  },

  {
    numero: 9,
    titulo: 'Tratamento de erros com pcall',
    teoria: [
      'error("mensagem") interrompe a execução da função atual e propaga um erro para quem a ' +
        'chamou — parecido com "lançar uma exceção" em outras linguagens.',
      'pcall(funcao, args...) chama uma função de forma protegida: em vez de deixar o erro derrubar ' +
        'o programa, pcall captura o erro e retorna múltiplos valores — o primeiro é um boolean (true ' +
        'se não houve erro, false se houve), e o segundo é o valor de retorno da função (ou a ' +
        'mensagem de erro, se falhou).',
    ],
    enunciado:
      'Implemente duas funções. Primeiro, dividir(a, b), que retorna a / b, mas chama ' +
      'error("divisão por zero") se b for 0. Segundo, dividirSeguro(a, b), que usa pcall para chamar ' +
      'dividir(a, b) sem quebrar o programa, e retorna dois valores: um boolean (true se deu certo) ' +
      'e o resultado da divisão (se deu certo) ou a mensagem "divisão por zero" (se deu erro).',
    dica:
      'local ok, resultado = pcall(dividir, a, b)\nif ok then\n  return true, resultado\nelse\n  return false, "divisão por zero"\nend',
    codigoInicial: `function dividir(a, b)\n  ${pendente('implemente dividir')}\nend\n\nfunction dividirSeguro(a, b)\n  ${pendente('implemente dividirSeguro')}\nend`,
    verificacao: {
      tipo: 'funcao',
      nome: 'dividirSeguro',
      nresultados: 2,
      casos: [
        { args: [10, 2], esperado: [true, 5], descricao: 'dividirSeguro(10, 2)' },
        { args: [9, 3], esperado: [true, 3], descricao: 'dividirSeguro(9, 3)' },
        { args: [10, 0], esperado: [false, 'divisão por zero'], descricao: 'dividirSeguro(10, 0)' },
      ],
    },
  },
];
