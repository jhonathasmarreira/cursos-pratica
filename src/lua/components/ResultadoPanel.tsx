import type { LinhaLog } from '../types';

const ICONE: Record<LinhaLog['tipo'], string> = {
  erro: '✖',
  sucesso: '✔',
  info: 'ℹ',
};

export function ResultadoPanel({ log }: { log: LinhaLog[] }) {
  return (
    <div data-testid="resultado-execucao" className="resultado-panel">
      {log.length === 0 && <p className="resultado-vazio">Execute o código para ver o resultado aqui.</p>}
      {log.map((linha, i) => (
        <p key={i} className={`resultado-linha resultado-${linha.tipo}`}>
          {ICONE[linha.tipo]} {linha.texto}
        </p>
      ))}
    </div>
  );
}
