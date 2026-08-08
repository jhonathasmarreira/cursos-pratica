import { EXERCICIOS } from '../exercicios';
import { useLuaStore } from '../store/useLuaStore';

const ICONE_STATUS: Record<string, string> = {
  pendente: '○',
  executando: '…',
  aprovado: '✔',
  reprovado: '✖',
};

export function Sidebar() {
  const exercicioAtual = useLuaStore((s) => s.exercicioAtual);
  const respostas = useLuaStore((s) => s.respostas);
  const irPara = useLuaStore((s) => s.irPara);
  const finalizarSessao = useLuaStore((s) => s.finalizarSessao);
  const reiniciarProgresso = useLuaStore((s) => s.reiniciarProgresso);

  const aprovados = EXERCICIOS.filter((ex) => respostas[ex.numero]?.status === 'aprovado').length;

  return (
    <aside className="lua-sidebar">
      <div className="lua-sidebar-header">
        <strong>Lua — Fundamentos</strong>
        <span data-testid="lua-placar">
          {aprovados}/{EXERCICIOS.length} exercícios aprovados
        </span>
      </div>

      <p className="lua-aviso">
        Seu progresso fica salvo no navegador (localStorage) — pode fechar a aba e continuar depois.
      </p>

      <ul data-testid="lista-exercicios" className="lista-exercicios">
        {EXERCICIOS.map((ex) => {
          const status = respostas[ex.numero]?.status ?? 'pendente';
          return (
            <li key={ex.numero}>
              <button
                data-testid={`exercicio-item-${ex.numero}`}
                className={`exercicio-item exercicio-${status} ${ex.numero === exercicioAtual ? 'exercicio-ativo' : ''}`}
                onClick={() => irPara(ex.numero)}
              >
                <span className="exercicio-numero">{String(ex.numero).padStart(2, '0')}</span>
                <span className="exercicio-titulo">{ex.titulo}</span>
                <span className={`exercicio-status-icone status-${status}`}>{ICONE_STATUS[status]}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <button data-testid="btn-finalizar-sessao" className="btn-primary btn-block" onClick={finalizarSessao}>
        Ver resumo da sessão
      </button>
      <button
        data-testid="btn-reiniciar-progresso"
        className="btn-secondary btn-block"
        onClick={() => {
          if (confirm('Isso apaga todo o progresso salvo (código escrito e resultados). Confirma?')) {
            reiniciarProgresso();
          }
        }}
      >
        Reiniciar progresso
      </button>
    </aside>
  );
}
