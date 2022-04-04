import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { javascript } from "@codemirror/lang-javascript";
import { StateField } from "@codemirror/state";
import {showPanel} from "@codemirror/panel";

import buildCodemod from "./build-codemod";
import { store } from './store';


function createInputPanel() {
    return createHelpPanel("Enter the input code here to transform:"); 
}

function createOutputPanel() {
    return createHelpPanel("Enter the output code here to be transformed:"); 
}

function createHelpPanel(text) {
    let dom = document.createElement("div");
    dom.textContent = text;
    dom.className = "cm-help-panel";
    dom.style = "background: yellow; padding: 2px";
    return { top: true, dom};
}

const helpPanelState = StateField.define({
  create: () => false,
    provide: (f) => showPanel.from(f, on =>  createInputPanel )
});

const outputHelpPanelState = StateField.define({
  create: () => false,
    provide: (f) => showPanel.from(f, on =>  createOutputPanel )
});


export default async function () {
    const sampleCode = `foo()`;

    const extensions = [basicSetup, javascript()];


    let { opcode, mode: oldMode  } = store.getState();
    const inputCode = oldMode === 'javascript' ? `foo()` : `{{hello-world}}`;
    const outputCode = oldMode === 'javascript' ? `foo.bar()` : `<HelloWorld />`;

    const listenChangesExtension = StateField.define({
	create: () => null,
	update: async (value, transaction) => {
	    if (transaction.docChanged) {
		const _input = transaction.newDoc.toString();
		const _output = destEditor.state.doc.toString();
		const codemod = await buildCodemod(_input, _output);
		transformEditor.setState(
		    EditorState.create({
			doc: codemod,
			extensions
		    })
		);
	    }
	    return null;
	},
    });

    const listenDestChanges = StateField.define({
	create: () => null,
	update: async (value, transaction) => {
	    if (transaction.docChanged) {
		const _output = transaction.newDoc.toString();
		const _input = editor.state.doc.toString();
		const codemod = await buildCodemod(_input, _output);
		transformEditor.setState(
		    EditorState.create({
			doc: codemod,
			extensions
		    })
		);
	    }
	    return null;
	},
    });

    let editor = new EditorView({
	state: EditorState.create({
	    doc: inputCode,
	    extensions: [...extensions, listenChangesExtension, helpPanelState],
	}),
	parent: document.getElementById("editor"),
    });

    const destEditor = new EditorView({
	state: EditorState.create({
	    doc: outputCode,
	    extensions: [...extensions, listenDestChanges, outputHelpPanelState],
	}),
	parent: document.getElementById("dest-editor"),
    });

    const codemod = await buildCodemod(inputCode, outputCode);

    const transformEditor = new EditorView({
	state: EditorState.create({
	    doc: codemod,
	    extensions
	}),
	parent: document.getElementById("transform-editor"),
    });

    const outputEditor = new EditorView({
	state: EditorState.create({
	    doc: sampleCode,
	    extensions
	}),
	parent: document.getElementById("output-editor"),
    });


    store.subscribe(async (action) => {
	
	const { opcode, mode } = store.getState();

	// Update input and output code only if mode changes
	if(mode !== oldMode) {
	    oldMode = mode;

	    // Update input code
	    const _inputCode = mode === 'javascript' ? `foo()` : `{{hello-world}}`;
	    editor.setState(
		EditorState.create({
		    doc: _inputCode,
		    extensions: [...extensions, listenChangesExtension],
		})
	    );

	    // Update output code
	    const _outputCode = mode === 'javascript' ? `foo.bar()` : `<HelloWorld />`;
	    destEditor.setState(
		EditorState.create({
		    doc: _outputCode,
		    extensions: [...extensions, listenDestChanges],
		})
	    );

	}
	// console.log(store.getState());
	const _output = destEditor.state.doc.toString();
	const _input = editor.state.doc.toString();

	const codemod = await buildCodemod(_input, _output);
	transformEditor.setState(
	    EditorState.create({
		doc: codemod,
		extensions
	    })
	);



    });
}
