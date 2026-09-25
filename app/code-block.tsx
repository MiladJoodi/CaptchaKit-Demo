"use client";

import { useState, type ReactNode } from "react";

function highlightCode(code: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const pattern =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#(?:[^\n]*))|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:import|export|from|const|let|var|function|async|await|return|if|else|type|interface|default|class|new|typeof|true|false|null|undefined|string|number|boolean|void|React)\b)|(\b(?:npm|pnpm|yarn|install|CAPTCHAKIT_SECRET)\b)|([A-Za-z_$][\w$]*)|([{}()[\].,;:=<>/*+\-!?|&]+)|(\s+)/g;

  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(code)) !== null) {
    if (match.index > last) {
      tokens.push(
        <span key={key++} className="tok-plain">
          {code.slice(last, match.index)}
        </span>,
      );
    }

    if (match[1]) {
      tokens.push(
        <span key={key++} className="tok-comment">
          {match[1]}
        </span>,
      );
    } else if (match[2]) {
      tokens.push(
        <span key={key++} className="tok-string">
          {match[2]}
        </span>,
      );
    } else if (match[3] || match[4]) {
      tokens.push(
        <span key={key++} className="tok-keyword">
          {match[3] || match[4]}
        </span>,
      );
    } else if (match[5]) {
      const id = match[5];
      const isTag = /^[A-Z]/.test(id);
      tokens.push(
        <span key={key++} className={isTag ? "tok-tag" : "tok-param"}>
          {id}
        </span>,
      );
    } else if (match[6]) {
      tokens.push(
        <span key={key++} className="tok-punct">
          {match[6]}
        </span>,
      );
    } else if (match[7]) {
      tokens.push(match[7]);
    }

    last = pattern.lastIndex;
  }

  if (last < code.length) {
    tokens.push(
      <span key={key++} className="tok-plain">
        {code.slice(last)}
      </span>,
    );
  }

  return tokens;
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5 15V7a2 2 0 0 1 2-2h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CodeBlock({
  code,
  filename,
}: {
  code: string;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);
  const highlighted = highlightCode(code.trimEnd());

  async function copy() {
    await navigator.clipboard.writeText(code.trimEnd() + "\n");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="doc-code">
      {filename ? <div className="doc-code-file">{filename}</div> : null}
      <button
        type="button"
        className={`copy-btn ${copied ? "is-copied" : ""}`}
        aria-label={copied ? "Copied" : "Copy code"}
        title={copied ? "Copied" : "Copy"}
        onClick={() => void copy()}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      <pre>
        <code>{highlighted}</code>
      </pre>
    </div>
  );
}

export function DocP({ children }: { children: ReactNode }) {
  return <p className="doc-p">{children}</p>;
}

export function DocH2({ children }: { children: ReactNode }) {
  return <h2 className="doc-h2">{children}</h2>;
}

export function DocH3({ children }: { children: ReactNode }) {
  return <h3 className="doc-h3">{children}</h3>;
}

export function DocList({ items }: { items: string[] }) {
  return (
    <ul className="doc-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function DocTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="doc-table-wrap">
      <table className="doc-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, i) => (
                <td key={`${cell}-${i}`}>
                  {cell.startsWith("`") && cell.endsWith("`") ? (
                    <code>{cell.slice(1, -1)}</code>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
