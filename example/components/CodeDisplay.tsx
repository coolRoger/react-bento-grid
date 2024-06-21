import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark as style } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeDisplayProps {
    code: string;
    language?: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({
    code,
    language = "tsx",
}) => {
    return (
        <div style={{ margin: "20px", maxHeight: 300, overflow: "auto" }}>
            <SyntaxHighlighter
                language={language}
                style={{ ...style, "code": {
                    fontSize: 12
                } }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeDisplay;
