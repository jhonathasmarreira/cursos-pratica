import { EXERCICIOS } from '../exercicios';
import { useLuaStore } from '../store/useLuaStore';

export function RelatorioPage() {
  const respostas = useLuaStore((s) => s.respostas);
  const voltarAosExercicios = useLuaStore((s) => s.voltarAosExercicios);

  const aprovados = EXERCICIOS.filter((ex) => respostas[ex.numero]?.status === 'aprovado');
  const pendentes = EXERCICIOS.filter((ex) => respostas[ex.numero]?.status !== 'aprovado');

  return (
    <div className="id-wrapper">
      <div className="id-card relatorio-card" data-testid="relatorio-sessao">
        <div className="id-header">
          <div className="id-logo">🌙</div>
          <h1>Resumo da sessão</h1>
          <p>Isso fica só no seu navegador — nada é enviado a lugar nenhum.</p>
        </div>

        <p className="relatorio-placar" data-testid="relatorio-placar">
          {aprovados.length} de {EXERCICIOS.length} exercícios aprovados
        </p>

        <ul className="relatorio-lista">
          {EXERCICIOS.map((ex) => {
            const status = respostas[ex.numero]?.status ?? 'pendente';
            return (
              <li key={ex.numero} className={`relatorio-item status-${status}`}>
                <span>{String(ex.numero).padStart(2, '0')}</span>
                <span className="relatorio-item-titulo">{ex.titulo}</span>
                <span>{status}</span>
              </li>
            );
          })}
        </ul>

        {pendentes.length > 0 && (
          <p className="relatorio-dica">
            Ainda faltam {pendentes.length} exercício(s). Volte quando quiser continuar de onde parou.
          </p>
        )}
        {pendentes.length === 0 && (
          <p className="relatorio-dica relatorio-completo">
            Você concluiu todos os exercícios do curso de Lua. 🎉
          </p>
        )}

        <button className="btn-primary btn-block" onClick={voltarAosExercicios} data-testid="btn-voltar-exercicios">
          Voltar aos exercícios
        </button>
      </div>
    </div>
  );
}
