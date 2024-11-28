import * as vscode from "vscode";
import * as babelParser from "@babel/parser";
import traverse from "@babel/traverse";
import axios from "axios";

async function analyzeCode(code: string): Promise<string[]> {
  const ast = babelParser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  let components: string[] = [];
  traverse(ast, {
    JSXElement(path) {
      const nameNode = path.node.openingElement.name;
      if (nameNode.type === "JSXIdentifier") {
        components.push(nameNode.name);
      }
    },
  });

  return components;
}

async function generateDocumentation(components: string[]): Promise<string> {
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiSecret = process.env.REACT_APP_HUGGING_FACE_API_KEY;

  const responses = await Promise.all(
    components.map(async (component) => {
      try {
        const response = await axios.post(
          `${apiUrl}`,
          {
            inputs: `Generate documentation for ${component}`,
          },
          {
            headers: {
              Authorization: `Bearer ${apiSecret}`,
            },
          }
        );
        return `### ${component}\n${JSON.stringify(response.data)}\n\n`;
      } catch (error) {
        console.error(
          `Error generating documentation for ${component}:`,
          error
        );
        return `### ${component}\nError generating documentation.\n\n`;
      }
    })
  );

  return responses.join("");
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.generateDocs",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const code = document.getText();
        const components = await analyzeCode(code);
        const docs = await generateDocumentation(components);
        const docUri = vscode.Uri.file(`${document.fileName}-docs.md`);
        await vscode.workspace.fs.writeFile(docUri, Buffer.from(docs));
        vscode.window.showInformationMessage("Documentation generated!");
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
