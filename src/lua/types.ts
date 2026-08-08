// Valores trocados entre JS e Lua nos casos de teste: números, strings,
// booleanos, nil (null) e arrays (viram tabelas sequenciais em Lua, 1-based).
// Dicionários (tabelas com chaves string) não são suportados como valor de
// entrada/saída dos testes automáticos — só como estrutura interna que o
// aluno usa dentro do próprio código Lua (ex: exercício 6).
export type LuaValor = number | string | boolean | null | LuaValor[];

export interface CasoTeste {
  /** Argumentos passados para a função Lua, na ordem. */
  args: LuaValor[];
  /**
   * Valor de retorno esperado. Se `nresultados` da verificação for maior
   * que 1, `esperado` é um array com um item por valor de retorno, na ordem.
   */
  esperado: LuaValor;
  /** Texto amigável mostrado no log, ex: "soma(2, 3) deve ser 5". */
  descricao: string;
}

export type Verificacao =
  | {
      tipo: 'saida';
      /** Uma linha esperada por chamada de print(), na ordem. */
      esperado: string[];
    }
  | {
      tipo: 'funcao';
      /** Nome da função global que o exercício pede para o aluno definir. */
      nome: string;
      /** Quantos valores de retorno a função deve produzir (padrão 1). */
      nresultados?: number;
      casos: CasoTeste[];
    };

export interface Exercicio {
  numero: number;
  titulo: string;
  /** Parágrafos explicando o conceito de Lua abordado, antes do enunciado. */
  teoria: string[];
  /** O que o exercício pede para o aluno fazer. */
  enunciado: string;
  dica?: string;
  codigoInicial: string;
  verificacao: Verificacao;
}

export type StatusExercicio = 'pendente' | 'executando' | 'aprovado' | 'reprovado';

export interface LinhaLog {
  tipo: 'info' | 'erro' | 'sucesso';
  texto: string;
}

export interface RespostaExercicio {
  codigo: string;
  status: StatusExercicio;
  log: LinhaLog[];
}

export interface ResultadoExecucao {
  status: Extract<StatusExercicio, 'aprovado' | 'reprovado'>;
  log: LinhaLog[];
}
