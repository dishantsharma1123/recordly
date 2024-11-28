import React, { useState } from "react";
import { MonacoEditor } from "@monaco-editor/react";
import "../../styles/CodeEditor.css";

const CodeEditor = () => {
  const [code, setCode] = useState("");

  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <div className="code-editor-container">
      <h2>Code IDE</h2>
      <MonacoEditor
        height={process.env.REACT_APP_EDITOR_HEIGHT || "500px"} // Dynamic height from environment variable
        defaultLanguage={
          process.env.REACT_APP_EDITOR_DEFAULT_LANGUAGE || "javascript"
        } // Dynamic language from environment variable
        defaultValue=""
        theme={process.env.REACT_APP_EDITOR_THEME || "vs-dark"} // Dynamic theme from environment variable
        onChange={handleEditorChange}
      />
      <div className="code-output">
        <h3>Code Output:</h3>
        <pre>{code}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
