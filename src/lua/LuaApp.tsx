import { useLuaStore } from './store/useLuaStore';
import { ExerciciosPage } from './pages/ExerciciosPage';
import { RelatorioPage } from './pages/RelatorioPage';

export function LuaApp() {
  const fase = useLuaStore((s) => s.fase);
  return fase === 'relatorio' ? <RelatorioPage /> : <ExerciciosPage />;
}
