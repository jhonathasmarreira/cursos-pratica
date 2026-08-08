import type { Exercicio } from '../types';

export function ExercicioDescricao({ exercicio }: { exercicio: Exercicio }) {
  return (
    <div className="exercicio-descricao" data-testid="exercicio-descricao">
      <span className="exercicio-numero-badge">Exercício {exercicio.numero} de 9</span>
      <h2>{exercicio.titulo}</h2>

      <div className="exercicio-teoria">
        {exercicio.teoria.map((paragrafo, i) => (
          <p key={i}>{paragrafo}</p>
        ))}
      </div>

      <div className="exercicio-enunciado">
        <strong>O que fazer:</strong>
        <p>{exercicio.enunciado}</p>
      </div>

      {exercicio.dica && (
        <p className="exercicio-dica">
          <strong>Dica:</strong> {exercicio.dica}
        </p>
      )}
    </div>
  );
}
