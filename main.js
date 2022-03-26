import "./style.css";

import setupSplit from "./src/setup-split";
import setupEditor from "./src/setup-editor";
import { store, setOpCode } from "./src/store";

setupSplit();

setupEditor();

document.getElementById("lst-opcode").addEventListener("change", (ev) => {
  console.log(ev.target.value);
  store.dispatch(setOpCode(ev.target.value));
});
