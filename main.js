import "./style.css";

import setupSplit from "./src/setup-split";
import setupEditor from "./src/setup-editor";
import { store, setOpCode, setMode } from "./src/store";

setupSplit();

setupEditor();

document.getElementById("lst-opcode").addEventListener("change", (ev) => {
  store.dispatch(setOpCode(ev.target.value));
});

document.getElementById("lst-mode").addEventListener("change", (ev) => {
  store.dispatch(setMode(ev.target.value));
});
