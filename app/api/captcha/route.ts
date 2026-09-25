import { createCaptchaHandlers } from "captchakit/server";

/**
 * CaptchaKit challenge + verify endpoint.
 * Image CAPTCHA needs the Node.js runtime (@napi-rs/canvas).
 *
 * Playground: skip shared IP rate-limiting so rapid option changes
 * (type/locale/difficulty) do not hit CAPTCHA_RATE_LIMITED (20/min).
 */
export const runtime = "nodejs";

export const { GET, POST } = createCaptchaHandlers({
  getIdentifier: () => crypto.randomUUID(),
});
