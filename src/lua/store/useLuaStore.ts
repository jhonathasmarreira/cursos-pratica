import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EXERCICIOS } from '../exercicios';
import type { RespostaExercicio, ResultadoExecucao } from '../types';

export type Fase = 'exercicios' | 'relatorio';

interface LuaState {
  fase: Fase;
  exercicioAtual: number;
  respostas: Record<number, RespostaExercicio>;

  irPara: (numero: number) => void;
  atualizarCodigo: (numero: number, codigo: string) => void;
  marcarExecutando: (numero: number) => void;
  registrarResultado: (numero: number, resultado: ResultadoExecucao) => void;
  finalizarSessao: () => void;
  voltarAosExercicios: () => void;
  reiniciarProgresso: () => void;
}

function respostasIniciais(): Record<number, RespostaExercicio> {
  const mapa: Record<number, RespostaExercicio> = {};
  for (const ex of EXERCICIOS) {
    mapa[ex.numero] = { codigo: ex.codigoInicial, status: 'pendente', log: [] };
  }
  return mapa;
}

// Diferente do store do simulador de avaliação (que nunca persiste, porque
// cada prova deve começar do zero), aqui o progresso é salvo no
// localStorage: é uma ferramenta de estudo pessoal, então faz sentido poder
// fechar a aba e continuar de onde parou depois. "reiniciarProgresso" limpa
// tudo, para quem quiser começar do zero de propósito.
export const useLuaStore = create<LuaState>()(
  persist(
    (set) => ({
      fase: 'exercicios',
      exercicioAtual: 1,
      respostas: respostasIniciais(),

      irPara: (numero) => set({ exercicioAtual: numero }),

      atualizarCodigo: (numero, codigo) =>
        set((s) => ({ respostas: { ...s.respostas, [numero]: { ...s.respostas[numero], codigo } } })),

      marcarExecutando: (numero) =>
        set((s) => ({
          respostas: { ...s.respostas, [numero]: { ...s.respostas[numero], status: 'executando' } },
        })),

      registrarResultado: (numero, resultado) =>
        set((s) => ({
          respostas: {
            ...s.respostas,
            [numero]: { ...s.respostas[numero], status: resultado.status, log: resultado.log },
          },
        })),

      finalizarSessao: () => set({ fase: 'relatorio' }),
      voltarAosExercicios: () => set({ fase: 'exercicios' }),

      reiniciarProgresso: () => set({ fase: 'exercicios', exercicioAtual: 1, respostas: respostasIniciais() }),
    }),
    { name: 'lua-estudos-progresso' }
  )
);
