// Página inicial do repositório: um hub simples que lista os cursos/estudos
// disponíveis. Cada curso é um mini-app React independente, com seu próprio
// entry point (ex: `lua/index.html` + `src/lua-main.tsx`) e seu próprio
// bundle — igual ao projeto "avaliacao", que também usa uma raiz separada
// dos simuladores em si (lá era `/cypress-test` e `/cucumber-test`; aqui é
// `/lua`, e no futuro outros cursos entram do mesmo jeito).
export default function App() {
  return (
    <div className="hub-wrapper">
      <div className="hub-conteudo">
        <header className="hub-header">
          <div className="hub-logo">📚</div>
          <h1>Cursos & Prática</h1>
          <p>
            Espaço pessoal de estudo: cada curso abaixo é uma ferramenta interativa própria, sem
            backend, sem cadastro e sem envio de nada pra ninguém — só você, o editor de código e
            exercícios com correção automática, na medida em que for aprendendo assuntos novos.
          </p>
        </header>

        <div className="hub-lista">
          <a className="curso-card" href="/lua/" data-testid="curso-lua">
            <div className="curso-card-topo">
              <div className="curso-card-icone">🌙</div>
              <span className="curso-card-titulo">Lua — Fundamentos</span>
              <span className="curso-card-tag">Disponível</span>
            </div>
            <p className="curso-card-descricao">
              9 exercícios práticos cobrindo a base da linguagem Lua: variáveis e tipos,
              operadores, condicionais, laços, tabelas (como array e como dicionário), funções
              com retorno múltiplo, closures e tratamento de erros com <code>pcall</code>. O
              código que você escreve roda de verdade, em uma máquina virtual Lua real (Fengari)
              executando direto no navegador — não é uma simulação da sintaxe, é Lua de verdade.
            </p>
          </a>

          <div className="curso-card curso-card-em-breve" data-testid="curso-em-breve">
            <div className="curso-card-topo">
              <div className="curso-card-icone">➕</div>
              <span className="curso-card-titulo">Próximo curso</span>
              <span className="curso-card-tag">Em breve</span>
            </div>
            <p className="curso-card-descricao">
              Reservado para o próximo assunto de estudo. Segue o mesmo modelo: pasta própria com
              entry point dedicado, exercícios com teoria + enunciado + correção automática.
            </p>
          </div>
        </div>

        <p className="hub-rodape">Sem coleta de dados, sem login, sem envio de e-mail. 100% local.</p>
      </div>
    </div>
  );
}
