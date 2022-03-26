import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup";
import {javascript} from "@codemirror/lang-javascript";
import { StateField } from '@codemirror/state';

import buildCodemod from './build-codemod';

export default function() {
  const sampleCode = `
import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup";
import {javascript} from "@codemirror/lang-javascript";
import Split from 'split.js';

let editor = new EditorView({
  state: EditorState.create({
    extensions: [basicSetup, javascript()]
  }),
    parent: document.getElementById('editor')
});

Split(['#split-0', '#split-1']);
Split(['#split-01', '#split-02'], {
    direction: 'vertical'
});
`;

  const inputCode = `foo()`;
  const outputCode = `foo.bar()`;

  const listenChangesExtension = StateField.define({
    // we won't use the actual StateField value, null or undefined is fine
    create: () => null,
    update: (value, transaction) => {
      if (transaction.docChanged) {
        // access new content via the Transaction
         console.log(transaction.newDoc.toString());
        const _input = transaction.newDoc.toString(); 
        const _output = destEditor.state.doc.toString();
        const codemod = buildCodemod(_input,_output, 'javascript');
        transformEditor.setState(
          EditorState.create({
      doc: codemod,
      extensions: [basicSetup, javascript()]
          })
)
      }
      return null;
    },
  });


  const listenDestChanges = StateField.define({
    // we won't use the actual StateField value, null or undefined is fine
    create: () => null,
    update: (value, transaction) => {
      if (transaction.docChanged) {
        // access new content via the Transaction
         console.log(transaction.newDoc.toString());
        const _output = transaction.newDoc.toString(); 
        const _input = editor.state.doc.toString();
        const codemod = buildCodemod(_input,_output, 'javascript');
        transformEditor.setState(
          EditorState.create({
      doc: codemod,
      extensions: [basicSetup, javascript()]
          })
)
      }
      return null;
    },
  });

  let editor = new EditorView({
    state: EditorState.create({
      doc: inputCode,
      extensions: [basicSetup, javascript(), listenChangesExtension]
    }),
    parent: document.getElementById('editor')
  });

  const destEditor = new EditorView({
    state: EditorState.create({
      doc: outputCode,
      extensions: [basicSetup, javascript(), listenDestChanges]
    }),
    parent: document.getElementById('dest-editor')
  });

        const codemod = buildCodemod(inputCode,outputCode, 'javascript');
  const transformEditor = new EditorView({
    state: EditorState.create({
      doc: codemod,
      extensions: [basicSetup, javascript()]
    }),
    parent: document.getElementById('transform-editor')
  });

  const outputEditor = new EditorView({
    state: EditorState.create({
      doc: sampleCode,
      extensions: [basicSetup, javascript()]
    }),
    parent: document.getElementById('output-editor')
  });

}
