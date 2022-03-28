import * as recast from "recast";

import opQuery from "./op-query";

import { babel, glimmer } from "ast-node-finder";

const { dispatchNodes } = babel;

export default function (source, dest, mode, opCode) {
  let ast = recast.parse(source);
  let _transformTemplate = "";
  let transformLogic = "";
  if (mode === "javascript") {
    let _inputNodeType = ast.program.body[0].type;

    let outAst = recast.parse(dest);
    let _outputNodeType = outAst.program.body[0].type;

    //const isSmartUpdate = _inputNodeType === _outputNodeType && this.get('nodeOp') === 'replace';
    const isSmartUpdate = false;

    let _allowSmartUpdate = false;

    transformLogic = dispatchNodes(ast).join();
    const smartOp = "";
    let _opQuery =
      isSmartUpdate && _allowSmartUpdate
        ? smartOp
        : opQuery(mode, opCode, dest);

    // TODO: Need to change to es6 export default
    _transformTemplate = `
          module.exports = function transformer(file, api) {
         const j = api.jscodeshift;
        const root = j(file.source);
        const body = root.get().value.program.body;
        ${transformLogic}
        ${_opQuery}
        return root.toSource();
      };`;
  } else {
      let _opQuery = opQuery(mode, opCode, dest);
    transformLogic = glimmer.dispatchNodes(ast, _opQuery).join();

    _transformTemplate = `
          module.exports = function(env) {
        let b = env.syntax.builders;
        ${transformLogic}

      };`;
  }

  let _codemod = recast.prettyPrint(recast.parse(_transformTemplate), {
    tabWidth: 2,
  }).code;
  return _codemod;
}
