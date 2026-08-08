import { lua, lauxlib, lualib, to_luastring, to_jsstring } from 'fengari';
import type { LuaValor, Verificacao, ResultadoExecucao, LinhaLog } from '../types';

// Motor de execução: roda o código Lua do aluno de verdade, em uma
// instância isolada da máquina virtual Fengari (Lua 5.3 implementado em
// JS puro — não é uma reimplementação simplificada da sintaxe, é o
// interpretador Lua de verdade rodando no navegador). Cada execução cria um
// estado (`lua_State`) novo do zero, então uma questão nunca vê variável
// global sobrando de uma execução anterior.

/** Tempo máximo (ms) de execução antes do motor abortar o script do aluno. */
const TIMEOUT_MS = 3000;
/** A cada quantas instruções Lua o relógio é conferido (ver `lua_sethook`). */
const INSTRUCOES_POR_VERIFICACAO = 1000;

function novoEstado(): { L: unknown; output: string[] } {
  const L = lauxlib.luaL_newstate();
  lualib.luaL_openlibs(L);

  const output: string[] = [];
  // Substitui o `print` global do Lua por uma função que só guarda o texto
  // num array JS, em vez de escrever no stdout (que não existe aqui).
  lua.lua_pushjsfunction(L, (L: unknown) => {
    const n = lua.lua_gettop(L);
    const partes: string[] = [];
    for (let i = 1; i <= n; i++) {
      partes.push(to_jsstring(lauxlib.luaL_tolstring(L, i)));
      lua.lua_pop(L, 1);
    }
    output.push(partes.join('\t'));
    return 0;
  });
  lua.lua_setglobal(L, to_luastring('print'));

  // Trava de segurança contra loop infinito: o Lua chama esse hook a cada
  // INSTRUCOES_POR_VERIFICACAO instruções executadas; se o tempo de parede
  // estourar o timeout, o hook lança um erro Lua e a execução para.
  const inicio = Date.now();
  lua.lua_sethook(
    L,
    (L: unknown) => {
      if (Date.now() - inicio > TIMEOUT_MS) {
        lauxlib.luaL_error(L, to_luastring('tempo de execução excedido (possível loop infinito)'));
      }
    },
    lua.LUA_MASKCOUNT,
    INSTRUCOES_POR_VERIFICACAO
  );

  return { L, output };
}

function pushValor(L: unknown, valor: LuaValor): void {
  if (valor === null) {
    lua.lua_pushnil(L);
  } else if (typeof valor === 'number') {
    lua.lua_pushnumber(L, valor);
  } else if (typeof valor === 'boolean') {
    lua.lua_pushboolean(L, valor);
  } else if (typeof valor === 'string') {
    lua.lua_pushstring(L, to_luastring(valor));
  } else {
    lua.lua_createtable(L, valor.length, 0);
    valor.forEach((item, i) => {
      pushValor(L, item);
      lua.lua_rawseti(L, -2, i + 1);
    });
  }
}

function lerValor(L: unknown, indice: number): LuaValor {
  const idx = lua.lua_absindex(L, indice);
  const tipo = lua.lua_type(L, idx);
  switch (tipo) {
    case lua.LUA_TNIL:
      return null;
    case lua.LUA_TBOOLEAN:
      return !!lua.lua_toboolean(L, idx);
    case lua.LUA_TNUMBER:
      return lua.lua_tonumber(L, idx);
    case lua.LUA_TSTRING:
      return to_jsstring(lua.lua_tostring(L, idx));
    case lua.LUA_TTABLE: {
      const tamanho = lua.lua_rawlen(L, idx);
      const arr: LuaValor[] = [];
      for (let i = 1; i <= tamanho; i++) {
        lua.lua_rawgeti(L, idx, i);
        arr.push(lerValor(L, -1));
        lua.lua_pop(L, 1);
      }
      return arr;
    }
    default:
      return null;
  }
}

/** Chama uma função global Lua com os argumentos dados e lê `nresultados` valores de retorno. */
function chamarFuncao(L: unknown, nome: string, args: LuaValor[], nresultados: number): LuaValor[] {
  lua.lua_getglobal(L, to_luastring(nome));
  if (!lua.lua_isfunction(L, -1)) {
    lua.lua_pop(L, 1);
    throw new Error(`a função "${nome}" não foi definida (ou não é uma função)`);
  }
  args.forEach((a) => pushValor(L, a));
  const status = lua.lua_pcall(L, args.length, nresultados, 0);
  if (status !== lua.LUA_OK) {
    const msg = to_jsstring(lua.lua_tostring(L, -1));
    lua.lua_pop(L, 1);
    throw new Error(msg);
  }
  // Os valores de retorno ficam na pilha do primeiro (mais fundo) ao último
  // (topo): -nresultados é o 1º valor retornado, -1 é o último.
  const resultados: LuaValor[] = [];
  for (let i = nresultados; i >= 1; i--) {
    resultados.push(lerValor(L, -i));
  }
  lua.lua_pop(L, nresultados);
  return resultados;
}

function valoresIguais(a: LuaValor, b: LuaValor): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => valoresIguais(v, b[i]));
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < 1e-9;
  }
  return a === b;
}

function formatarValor(v: LuaValor): string {
  if (v === null) return 'nil';
  if (Array.isArray(v)) return `{${v.map(formatarValor).join(', ')}}`;
  if (typeof v === 'string') return JSON.stringify(v);
  return String(v);
}

function mensagemDeErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : String(erro);
}

export function executarExercicio(codigo: string, verificacao: Verificacao): ResultadoExecucao {
  const log: LinhaLog[] = [];
  const { L, output } = novoEstado();

  const statusCarga = lauxlib.luaL_dostring(L, to_luastring(codigo));
  if (statusCarga !== lua.LUA_OK) {
    const msg = to_jsstring(lua.lua_tostring(L, -1));
    log.push({ tipo: 'erro', texto: msg });
    return { status: 'reprovado', log };
  }

  if (verificacao.tipo === 'saida') {
    const esperado = verificacao.esperado;
    const bateu = output.length === esperado.length && output.every((linha, i) => linha === esperado[i]);
    log.push({ tipo: 'info', texto: `Saída esperada:\n${esperado.join('\n') || '(nenhuma)'}` });
    log.push({ tipo: 'info', texto: `Saída obtida:\n${output.join('\n') || '(nenhuma)'}` });
    log.push(
      bateu
        ? { tipo: 'sucesso', texto: 'A saída do script bateu com o esperado.' }
        : { tipo: 'erro', texto: 'A saída do script não bateu com o esperado.' }
    );
    return { status: bateu ? 'aprovado' : 'reprovado', log };
  }

  // verificacao.tipo === 'funcao': roda todos os casos de teste (mesmo depois
  // de um caso falhar) para que o aluno veja de uma vez só tudo que ainda
  // precisa ajustar, em vez de descobrir os erros um de cada vez.
  const nresultados = verificacao.nresultados ?? 1;
  let todosPassaram = true;
  for (const caso of verificacao.casos) {
    try {
      const resultado = chamarFuncao(L, verificacao.nome, caso.args, nresultados);
      const obtido: LuaValor = nresultados === 1 ? resultado[0] : resultado;
      const esperado = caso.esperado;
      const bateu = valoresIguais(obtido, esperado);
      if (bateu) {
        log.push({ tipo: 'sucesso', texto: `${caso.descricao} → ${formatarValor(obtido)}` });
      } else {
        todosPassaram = false;
        log.push({
          tipo: 'erro',
          texto: `${caso.descricao} → esperado ${formatarValor(esperado)}, obtido ${formatarValor(obtido)}`,
        });
      }
    } catch (erro) {
      todosPassaram = false;
      log.push({ tipo: 'erro', texto: `${caso.descricao} → erro: ${mensagemDeErro(erro)}` });
    }
  }

  return { status: todosPassaram ? 'aprovado' : 'reprovado', log };
}
