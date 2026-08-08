import { useState } from 'react';
import { EXERCICIOS } from '../exercicios';
import { useLuaStore } from '../store/useLuaStore';
import { executarExercicio } from '../engine/runner';
import { Sidebar } from '../components/Sidebar';
import { CodeEditor } from '../components/CodeEditor';
import { ExercicioDescricao } from '../components/ExercicioDescricao';
import { ResultadoPanel } from '../components/ResultadoPanel';

export function ExerciciosPage() {
  const exercicioAtual = useLuaStore((s) => s.exercicioAtual);
  const respostas = useLuaStore((s) => s.respostas);
  const irPara = useLuaStore((s) => s.irPara);
  const atualizarCodigo = useLuaStore((s) => s.atualizarCodigo);
  const marcarExecutando = useLuaStore((s) => s.marcarExecutando);
  const registrarResultado = useLuaStore((s) => s.registrarResultado);

  const [rodando, setRodando] = useState(false);

  const exercicio = EXERCICIOS.find((e) => e.numero === exercicioAtual) ?? EXERCICIOS[0];
  const resposta = respostas[exercicio.numero];
  const proximo = EXERCICIOS.find((e) => e.numero === exercicio.numero + 1);

  // A execução do Lua via Fengari é síncrona (não há sandbox remoto pra
  // esperar, como no simulador de Cypress), mas o setTimeout(0) garante que
  // o React tenha a chance de pintar o estado "executando…" antes do motor
  // rodar o script — sem isso, um exercício rápido nem chega a mostrar o
  // estado intermediário.
  async function executar() {
    if (rodando) return;
    setRodando(true);
    marcarExecutando(exercicio.numero);
    await new Promise((r) => setTimeout(r, 0));
    const resultado = executarExercicio(resposta.codigo, exercicio.verificacao);
    registrarResultado(exercicio.numero, resultado);
    setRodando(false);
  }

  return (
    <div className="lua-shell">
      <Sidebar />

      <main className="lua-main">
        <ExercicioDescricao exercicio={exercicio} />

        <div className="lua-editor">
          <CodeEditor
            value={resposta.codigo}
            onChange={(codigo) => atualizarCodigo(exercicio.numero, codigo)}
            onExecutar={executar}
          />
          <div className="lua-editor-acoes">
            <button data-testid="btn-executar" className="btn-primary" onClick={executar} disabled={rodando}>
              {rodando ? 'Executando…' : 'Executar (Ctrl+Enter)'}
            </button>
            {resposta.status === 'aprovado' && proximo && (
              <button
                data-testid="btn-proximo-exercicio"
                className="btn-secondary"
                onClick={() => irPara(proximo.numero)}
              >
                Próximo exercício →
              </button>
            )}
            <span data-testid="exercicio-status" className={`exercicio-badge status-${resposta.status}`}>
              {resposta.status}
            </span>
          </div>
          <ResultadoPanel log={resposta.log} />
        </div>
      </main>
    </div>
  );
}
