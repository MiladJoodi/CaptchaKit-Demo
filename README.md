# CaptchaKit Playground

Public demo for the published [`captchakit`](https://www.npmjs.com/package/captchakit) npm package (`0.1.4`).

## Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vercel

1. Deploy this repo.
2. Set environment variable `CAPTCHAKIT_SECRET` (min 32 characters) in the Vercel project settings.
3. Redeploy.

Uses only the published npm package — no CaptchaKit source is vendored here.
