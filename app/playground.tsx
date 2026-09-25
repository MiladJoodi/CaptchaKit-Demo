"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Captcha,
  type CaptchaType,
  type Difficulty,
  type Locale,
  type Theme,
} from "captchakit";
import { DocsSection, NAV_ITEMS, type SectionId } from "./docs-content";
import "./captchakit.css";

const TYPES: CaptchaType[] = ["text", "number", "math", "image"];
const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

function localesForType(type: CaptchaType): Locale[] {
  return type === "number" || type === "math" ? ["en", "fa"] : ["en"];
}

type Status =
  | { kind: "waiting" }
  | { kind: "verified"; token: string }
  | { kind: "error"; code: string };

type UiMode = "light" | "dark";

function snippetFor(opts: {
  type: CaptchaType;
  locale: Locale;
  difficulty: Difficulty;
  theme: Theme;
}): string {
  return `<Captcha
  type="${opts.type}"
  locale="${opts.locale}"
  difficulty="${opts.difficulty}"
  theme="${opts.theme}"
  onVerify={(token) => {}}
  onError={(error) => {}}
/>`;
}

function highlightJsx(code: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const pattern =
    /(<\/?)([A-Za-z][\w.]*)|(\/?>)|(\s+)([A-Za-z_$][\w$]*)(=)|("(?:\\.|[^"\\])*")|(=>|[{}()[\],])|([A-Za-z_$][\w$]*)|(\s+)/g;

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

    if (match[2]) {
      tokens.push(
        <span key={key++} className="tok-punct">
          {match[1]}
        </span>,
      );
      tokens.push(
        <span key={key++} className="tok-tag">
          {match[2]}
        </span>,
      );
    } else if (match[3]) {
      tokens.push(
        <span key={key++} className="tok-punct">
          {match[3]}
        </span>,
      );
    } else if (match[5]) {
      tokens.push(match[4]);
      tokens.push(
        <span key={key++} className="tok-attr">
          {match[5]}
        </span>,
      );
      tokens.push(
        <span key={key++} className="tok-punct">
          {match[6]}
        </span>,
      );
    } else if (match[7]) {
      tokens.push(
        <span key={key++} className="tok-string">
          {match[7]}
        </span>,
      );
    } else if (match[8]) {
      const t = match[8];
      tokens.push(
        <span
          key={key++}
          className={t === "=>" ? "tok-keyword" : "tok-punct"}
        >
          {t}
        </span>,
      );
    } else if (match[9]) {
      tokens.push(
        <span key={key++} className="tok-param">
          {match[9]}
        </span>,
      );
    } else if (match[10]) {
      tokens.push(match[10]);
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

function ChipGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const active = wrap.querySelector<HTMLButtonElement>(".ck-chip.is-on");
    if (!active) return;
    setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
  }, [value, options]);

  return (
    <div className="ck-row">
      <span className="ck-label">{label}</span>
      <div className="ck-chips" ref={wrapRef} data-count={options.length}>
        <span
          className="ck-indicator"
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: indicator.width,
          }}
        />
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`ck-chip ${opt === value ? "is-on" : ""}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 14.5A7.8 7.8 0 0 1 9.5 3 8.5 8.5 0 1 0 21 14.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function TryLivePanel({ uiMode }: { uiMode: UiMode }) {
  const [type, setType] = useState<CaptchaType>("math");
  const [locale, setLocale] = useState<Locale>("en");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [status, setStatus] = useState<Status>({ kind: "waiting" });
  const [copied, setCopied] = useState(false);

  const theme: Theme = uiMode;
  const localeOptions = localesForType(type);

  useEffect(() => {
    if (!localeOptions.includes(locale)) setLocale("en");
  }, [locale, localeOptions]);

  const [applied, setApplied] = useState({
    type,
    locale,
    difficulty,
    theme,
  });

  useEffect(() => {
    const t = window.setTimeout(() => {
      setApplied({ type, locale, difficulty, theme });
      setStatus({ kind: "waiting" });
    }, 160);
    return () => window.clearTimeout(t);
  }, [type, locale, difficulty, theme]);

  const snippet = useMemo(
    () => snippetFor({ type, locale, difficulty, theme }),
    [type, locale, difficulty, theme],
  );

  const highlighted = useMemo(() => highlightJsx(snippet), [snippet]);
  const key = `${applied.type}-${applied.locale}-${applied.difficulty}-${applied.theme}`;

  async function copy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="try-panel anim-in">
      <div className="try-intro">
        <h2 className="doc-h2">Try Live</h2>
        <p className="doc-p">
          Change options and solve a live CAPTCHA. The snippet updates as you
          go.
        </p>
      </div>

      <div className="panel">
        <div className="controls">
          <ChipGroup label="Type" value={type} options={TYPES} onChange={setType} />
          <ChipGroup
            label="Locale"
            value={locale}
            options={localeOptions}
            onChange={setLocale}
          />
          <ChipGroup
            label="Level"
            value={difficulty}
            options={DIFFICULTIES}
            onChange={setDifficulty}
          />
        </div>

          <div className="stage">
            <div className="stage-head">
              <span>Challenge</span>
              <span className={`status ${status.kind}`}>
                {status.kind === "verified"
                  ? "Verified"
                  : status.kind === "error"
                    ? "Wrong answer"
                    : "Ready"}
              </span>
            </div>
            <div className={`stage-board is-${applied.theme}`}>
              <div className="stage-pop" key={key}>
                <Captcha
                  type={applied.type}
                  locale={applied.locale}
                  difficulty={applied.difficulty}
                  theme={applied.theme}
                  onVerify={(token) => setStatus({ kind: "verified", token })}
                  onError={() => setStatus({ kind: "error", code: "invalid" })}
                />
              </div>
            </div>
          </div>
        <div className="code">
          <div className="code-shine" aria-hidden />
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
      </div>
    </div>
  );
}

export default function Playground() {
  const [uiMode, setUiMode] = useState<UiMode>("light");
  const [section, setSection] = useState<SectionId>("try");

  return (
    <div className={`app ${uiMode}`} data-mode={uiMode}>
      <div className="app-bg" aria-hidden>
        <div className="bg-blob bg-blob-a" />
        <div className="bg-blob bg-blob-b" />
        <div className="bg-blob bg-blob-c" />
        <div className="bg-grid" />
      </div>

      <div className="docs-shell">
        <header className="docs-header anim-in delay-1">
          <h1 className="brand">CaptchaKit</h1>

          <div className="hero-actions">
            <button
              type="button"
              className={`try-link ${section === "try" ? "is-active" : ""}`}
              onClick={() => setSection("try")}
            >
              <span className="try-dot" />
              Try Live
            </button>

            <a
              className="icon-link"
              href="https://github.com/MiladJoodi/CaptchaKit"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              title="GitHub"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 7.5c.85 0 1.71.12 2.51.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.59.69.48A10.05 10.05 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
              </svg>
            </a>

            <button
              type="button"
              className="mode-btn"
              aria-label={
                uiMode === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
              onClick={() =>
                setUiMode((m) => (m === "light" ? "dark" : "light"))
              }
            >
              <span className={`mode-ico ${uiMode === "light" ? "show" : ""}`}>
                <SunIcon />
              </span>
              <span className={`mode-ico ${uiMode === "dark" ? "show" : ""}`}>
                <MoonIcon />
              </span>
            </button>

            <a
              className="npm-btn"
              href="https://www.npmjs.com/package/captchakit"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View captchakit on npm"
              title="npm"
            >
              <img
                className="npm-logo"
                src="/npm.webp"
                alt="npm"
                width={48}
                height={18}
              />
            </a>
          </div>
        </header>

        <div className="docs-layout anim-in delay-2">
          <aside className="docs-nav" aria-label="Documentation">
            <p className="docs-nav-title">Docs</p>
            <nav className="docs-nav-list">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`docs-nav-item ${section === item.id ? "is-active" : ""} ${item.live ? "is-live" : ""}`}
                  onClick={() => setSection(item.id)}
                >
                  {item.live ? <span className="try-dot" /> : null}
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="docs-main" key={section}>
            {section === "try" ? (
              <TryLivePanel uiMode={uiMode} />
            ) : (
              <DocsSection id={section} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
