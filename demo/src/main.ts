import './style.css';
import { avery as a } from 'avery';
import * as monaco from 'monaco-editor';
import AveryDefs from 'avery/dist/index.d.ts?raw';
import AveryArrayDefs from 'avery/dist/array.d.ts?raw';
import AveryBooleanDefs from 'avery/dist/boolean.d.ts?raw';
import AveryNumberDefs from 'avery/dist/number.d.ts?raw';
import AveryObjectDefs from 'avery/dist/object.d.ts?raw';
import AveryStringDefs from 'avery/dist/string.d.ts?raw';
import AveryValidatorDefs from 'avery/dist/validator.d.ts?raw';
import AveryResultDefs from 'avery/dist/monad/result.d.ts?raw';

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { Validator } from '../../dist/validator';

// @ts-ignore
window.a = a;

self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

let editor: monaco.editor.IStandaloneCodeEditor;
const startingCode = `import { avery as a } from "avery"

function getSchema() {
  // Your schema here...
  return a.string()
}`;

function main() {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2015,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  });

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    AveryDefs,
    'file:///node_modules/@types/avery/index.d.ts'
  );
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    AveryArrayDefs,
    'file:///node_modules/@types/avery/array.d.ts'
  );
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    AveryBooleanDefs,
    'file:///node_modules/@types/avery/boolean.d.ts'
  );
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    AveryNumberDefs,
    'file:///node_modules/@types/avery/number.d.ts'
  );
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    AveryObjectDefs,
    'file:///node_modules/@types/avery/object.d.ts'
  );
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    AveryStringDefs,
    'file:///node_modules/@types/avery/string.d.ts'
  );
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    AveryValidatorDefs,
    'file:///node_modules/@types/avery/validator.d.ts'
  );
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    AveryResultDefs,
    'file:///node_modules/@types/avery/monad/result.d.ts'
  );

  editor = monaco.editor.create(document.getElementById('schema')!, {
    model: monaco.editor.createModel(
      startingCode,
      'typescript',
      monaco.Uri.parse('file:///main.ts')
    ),
  });
}

const dataEl = document.getElementById('data')! as HTMLTextAreaElement;
const resultEl = document.getElementById('result')! as HTMLTextAreaElement;
document.getElementById('runbtn')?.addEventListener('click', () => {
  const code = editor.getValue();
  const idx = code.indexOf('function getSchema() {');
  const func = code.substring(idx);
  const data = dataEl.value;

  const f = new Function(
    'data',
    `"use strict";
    ${func}
    return getSchema().validate(data)`
  );

  const result: ReturnType<Validator<unknown, unknown>['validate']> = f(
    JSON.parse(data)
  );
  if (result.isOk()) {
    resultEl.innerHTML = `OK:\n${JSON.stringify(result.unwrap())}`;
  } else {
    resultEl.innerHTML = `Error:\n${JSON.stringify(result.unwrapErr())}`;
  }
});

main();
