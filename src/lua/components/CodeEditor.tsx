import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { lua } from '@codemirror/legacy-modes/mode/lua';

const linguagemLua = StreamLanguage.define(lua);

interface Props {
  value: string;
  onChange: (value: string) => void;
  onExecutar?: () => void;
}

export function CodeEditor({ value, onChange, onExecutar }: Props) {
  return (
    <div
      data-testid="code-editor"
      className="code-editor-wrapper"
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          onExecutar?.();
        }
      }}
    >
      <CodeMirror
        value={value}
        height="320px"
        theme="dark"
        extensions={[linguagemLua]}
        onChange={onChange}
        basicSetup={{ lineNumbers: true, foldGutter: false }}
      />
    </div>
  );
}
