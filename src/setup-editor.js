import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { javascript } from "@codemirror/lang-javascript";
import { StateField } from "@codemirror/state";

import buildCodemod from "./build-codemod";
import { store } from './store';

export default function () {
  const sampleCode = `foo()`;

  const inputCode = `foo()`;
  const outputCode = `foo.bar()`;


const { opcode, mode } = store.getState();
  const listenChangesExtension = StateField.define({
    create: () => null,
    update: (value, transaction) => {
      if (transaction.docChanged) {
        const _input = transaction.newDoc.toString();
        const _output = destEditor.state.doc.toString();
          const codemod = buildCodemod(_input, _output, mode, opcode);
        transformEditor.setState(
          EditorState.create({
            doc: codemod,
            extensions: [basicSetup, javascript()],
          })
        );
      }
      return null;
    },
  });

  const listenDestChanges = StateField.define({
    create: () => null,
    update: (value, transaction) => {
      if (transaction.docChanged) {
        const _output = transaction.newDoc.toString();
        const _input = editor.state.doc.toString();
          const codemod = buildCodemod(_input, _output, mode, opcode);
        transformEditor.setState(
          EditorState.create({
            doc: codemod,
            extensions: [basicSetup, javascript()],
          })
        );
      }
      return null;
    },
  });

  let editor = new EditorView({
    state: EditorState.create({
      doc: inputCode,
      extensions: [basicSetup, javascript(), listenChangesExtension],
    }),
    parent: document.getElementById("editor"),
  });

  const destEditor = new EditorView({
    state: EditorState.create({
      doc: outputCode,
      extensions: [basicSetup, javascript(), listenDestChanges],
    }),
    parent: document.getElementById("dest-editor"),
  });

    const codemod = buildCodemod(inputCode, outputCode, mode, opcode);
  const transformEditor = new EditorView({
    state: EditorState.create({
      doc: codemod,
      extensions: [basicSetup, javascript()],
    }),
    parent: document.getElementById("transform-editor"),
  });

  const outputEditor = new EditorView({
    state: EditorState.create({
      doc: sampleCode,
      extensions: [basicSetup, javascript()],
    }),
    parent: document.getElementById("output-editor"),
  });


    store.subscribe(() => {
	
	// console.log(store.getState());
	const { opcode, mode } = store.getState();
	const _output = destEditor.state.doc.toString();
	const _input = editor.state.doc.toString();
	const codemod = buildCodemod(_input, _output, mode, opcode);
	transformEditor.setState(
	    EditorState.create({
		doc: codemod,
		extensions: [basicSetup, javascript()],
	    })
	);

    });
}
