"use client";

import type { ReactNode } from "react";
import {
  CodeBlock,
  DocH2,
  DocH3,
  DocList,
  DocP,
  DocTable,
} from "./code-block";

export type SectionId =
  | "intro"
  | "install"
  | "quickstart"
  | "types"
  | "locale"
  | "styling"
  | "server"
  | "try";

export const NAV_ITEMS: {
  id: SectionId;
  label: string;
  live?: boolean;
}[] = [
  { id: "intro", label: "Introduction" },
  { id: "install", label: "Installation" },
  { id: "quickstart", label: "Quick start" },
  { id: "types", label: "Types & difficulty" },
  { id: "locale", label: "Localization" },
  { id: "styling", label: "Styling" },
  { id: "server", label: "Server API" },
  { id: "try", label: "Try live", live: true },
];

export function DocsSection({ id }: { id: Exclude<SectionId, "try"> }) {
  return <article className="doc-article anim-in">{CONTENT[id]}</article>;
}

const CONTENT: Record<Exclude<SectionId, "try">, ReactNode> = {
  intro: (
    <>
      <DocH2>Introduction</DocH2>
      <DocP>
        CaptchaKit is a self-hosted CAPTCHA for React and Next.js. No database,
        Redis, or external CAPTCHA provider is required.
      </DocP>
      <DocP>
        Answers are generated and verified on the server. The browser never
        receives a plaintext answer outside the visible challenge itself.
      </DocP>
      <DocH3>Features</DocH3>
      <DocList
        items={[
          "CAPTCHA types: text, number, math, image",
          "Locales: English (en) and Persian (fa, RTL)",
          "Difficulty: easy, medium, hard",
          "React <Captcha /> with light/dark themes",
          "HMAC-signed short-lived tokens",
          "One-time challenge and proof consumption",
          "Next.js App Router helpers via createCaptchaHandlers()",
        ]}
      />
    </>
  ),

  install: (
    <>
      <DocH2>Installation</DocH2>
      <DocP>Install the package from npm:</DocP>
      <CodeBlock code={`npm install captchakit`} filename="terminal" />
      <DocP>
        Then import the React component and default styles in your client UI.
      </DocP>
      <CodeBlock
        filename="form.tsx"
        code={`import { Captcha } from "captchakit";
import "captchakit/styles.css";`}
      />
    </>
  ),

  quickstart: (
    <>
      <DocH2>Quick start</DocH2>

      <DocH3>1. Add your secret</DocH3>
      <DocP>Create `.env.local` in your Next.js project:</DocP>
      <CodeBlock
        filename=".env.local"
        code={`CAPTCHAKIT_SECRET=your-long-random-secret-at-least-32-chars`}
      />
      <DocP>Keep this value server-side only.</DocP>

      <DocH3>2. Add the CAPTCHA API</DocH3>
      <DocP>Create `app/api/captcha/route.ts`:</DocP>
      <CodeBlock
        filename="app/api/captcha/route.ts"
        code={`import { createCaptchaHandlers } from "captchakit/server";

export const { GET, POST } = createCaptchaHandlers();`}
      />
      <DocP>CaptchaKit uses `/api/captcha` by default.</DocP>

      <DocH3>3. Add CAPTCHA to your form</DocH3>
      <CodeBlock
        filename="app/form.tsx"
        code={`"use client";

import { useState } from "react";
import { Captcha } from "captchakit";
import "captchakit/styles.css";

export default function Form() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please complete the CAPTCHA first.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        captchaToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    alert("Form submitted successfully!");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        placeholder="you@example.com"
        required
      />

      <Captcha
        type="math"
        locale="fa"
        difficulty="easy"
        onVerify={setCaptchaToken}
        onError={() => setCaptchaToken(null)}
      />

      <button type="submit" disabled={!captchaToken}>
        Submit
      </button>
    </form>
  );
}`}
      />
      <DocP>
        When the user solves the CAPTCHA, `onVerify` gives you a proof token.
        Send that token with the action you want to protect.
      </DocP>

      <DocH3>4. Verify on your server</DocH3>
      <CodeBlock
        filename="app/api/register/route.ts"
        code={`import { verifyCaptcha } from "captchakit/server";

export async function POST(request: Request) {
  const { email, captchaToken } = await request.json();

  const result = await verifyCaptcha({
    token: captchaToken,
  });

  if (!result.success) {
    return Response.json(
      { error: result.error },
      { status: 400 },
    );
  }

  // CAPTCHA is valid — continue with your action.

  return Response.json({
    success: true,
    email,
  });
}`}
      />
      <DocP>
        Do not trust `onVerify` on the client alone. Always verify the proof
        token on your server before performing the protected action.
      </DocP>
    </>
  ),

  types: (
    <>
      <DocH2>Types & difficulty</DocH2>
      <DocH3>CAPTCHA types</DocH3>
      <DocTable
        headers={["Type", "Description"]}
        rows={[
          ["`text`", "Random characters with ambiguous glyphs excluded"],
          ["`number`", "Random digit sequence"],
          ["`math`", "Arithmetic expression; user enters the numeric result"],
          ["`image`", "Distorted characters returned as an SVG data URL"],
        ]}
      />
      <DocH3>Difficulty</DocH3>
      <DocTable
        headers={["Value", "Behavior"]}
        rows={[
          ["`easy`", "Shorter and simpler challenges"],
          ["`medium`", "Default balance of complexity and readability"],
          ["`hard`", "Longer and more difficult challenges"],
        ]}
      />
      <CodeBlock
        filename="example.tsx"
        code={`<Captcha
  type="math"
  difficulty="medium"
  onVerify={(token) => {}}
/>`}
      />
    </>
  ),

  locale: (
    <>
      <DocH2>Localization</DocH2>
      <DocP>English UI is LTR:</DocP>
      <CodeBlock code={`<Captcha locale="en" />`} filename="example.tsx" />
      <DocP>Persian UI is RTL:</DocP>
      <CodeBlock code={`<Captcha locale="fa" />`} filename="example.tsx" />
      <DocP>
        Persian digit input is normalized on the server before verification.
        Locale `fa` is available for `number` and `math` types.
      </DocP>
    </>
  ),

  styling: (
    <>
      <DocH2>Styling</DocH2>
      <DocH3>Theme</DocH3>
      <CodeBlock code={`<Captcha theme="dark" />`} filename="example.tsx" />
      <DocP>The default theme is `light`.</DocP>

      <DocH3>Custom classes</DocH3>
      <DocP>
        Style individual parts with `classNames`. This works with plain CSS, CSS
        Modules, Tailwind CSS, or any class-based system.
      </DocP>
      <CodeBlock
        filename="example.tsx"
        code={`<Captcha
  classNames={{
    container: "my-captcha",
    challenge: "my-challenge",
    input: "my-input",
    button: "my-button",
    error: "my-error",
  }}
/>`}
      />

      <DocH3>Tailwind CSS</DocH3>
      <DocP>
        Pass Tailwind utilities through `classNames`. Keep importing
        `captchakit/styles.css` for base structure, or override heavily with
        your own utilities.
      </DocP>
      <CodeBlock
        filename="example.tsx"
        code={`<Captcha
  theme="light"
  classNames={{
    container: "w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-3 shadow-sm",
    challenge: "rounded-lg bg-zinc-50 font-mono text-lg tracking-wide",
    input: "mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
    button: "mt-2 w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800",
    error: "mt-2 text-sm text-red-600",
  }}
  onVerify={(token) => {}}
/>`}
      />

      <DocH3>CSS variables</DocH3>
      <CodeBlock
        filename="globals.css"
        code={`:root {
  --captchakit-primary: #18181b;
  --captchakit-background: #ffffff;
  --captchakit-text: #18181b;
  --captchakit-muted: #71717a;
  --captchakit-border: #e4e4e7;
  --captchakit-error: #dc2626;
  --captchakit-radius: 8px;
}`}
      />

      <DocH3>Import styles</DocH3>
      <CodeBlock
        filename="app.tsx"
        code={`import "captchakit/styles.css";`}
      />
    </>
  ),

  server: (
    <>
      <DocH2>Server API</DocH2>
      <DocP>Import server helpers from `captchakit/server`:</DocP>
      <CodeBlock
        filename="server.ts"
        code={`import {
  createCaptchaHandlers,
  createChallenge,
  verifyCaptcha,
} from "captchakit/server";`}
      />

      <DocH3>createCaptchaHandlers</DocH3>
      <CodeBlock
        filename="app/api/captcha/route.ts"
        code={`export const { GET, POST } = createCaptchaHandlers({
  getIdentifier: (request) => {
    // Optional rate-limit key (default: IP or "anonymous")
    return request.headers.get("x-forwarded-for") ?? "anonymous";
  },
});`}
      />

      <DocH3>createChallenge</DocH3>
      <CodeBlock
        filename="server.ts"
        code={`const challenge = await createChallenge({
  type: "math",
  locale: "fa",
  difficulty: "medium",
  identifier: "user-or-ip",
});`}
      />

      <DocH3>verifyCaptcha</DocH3>
      <CodeBlock
        filename="server.ts"
        code={`const result = await verifyCaptcha({
  token: proofToken,
});

if (!result.success) {
  // result.error — e.g. CAPTCHA_EXPIRED, CAPTCHA_INVALID
}`}
      />

      <DocH3>Error codes</DocH3>
      <DocTable
        headers={["Code", "Meaning"]}
        rows={[
          ["`CAPTCHA_EXPIRED`", "Challenge or proof has expired"],
          ["`CAPTCHA_INVALID`", "Invalid, malformed, or tampered token"],
          ["`CAPTCHA_ALREADY_USED`", "Already consumed"],
          ["`CAPTCHA_MAX_ATTEMPTS`", "Too many incorrect answers"],
          ["`CAPTCHA_RATE_LIMITED`", "Too many challenges for identifier"],
          ["`CAPTCHA_INVALID_ANSWER`", "Answer does not match"],
          ["`CAPTCHA_MISSING_SECRET`", "Secret missing or too short"],
        ]}
      />
    </>
  ),
};
