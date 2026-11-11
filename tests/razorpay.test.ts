import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Razorpay signature verification", () => {
  afterEach(() => vi.unstubAllEnvs());

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("RAZORPAY_KEY_ID", "rzp_test_example");
    vi.stubEnv("RAZORPAY_KEY_SECRET", "checkout-secret");
    vi.stubEnv("RAZORPAY_WEBHOOK_SECRET", "webhook-secret");
  });

  it("blocks live payment credentials in the V2 development environment", async () => {
    vi.stubEnv("LUNCHBOX_ENV", "v2");
    vi.stubEnv("ENABLE_PAYMENTS", "true");
    vi.stubEnv("RAZORPAY_KEY_ID", "rzp_live_example");
    vi.resetModules();
    const { isRazorpayConfigured } = await import("@/lib/razorpay");
    expect(isRazorpayConfigured()).toBe(false);
  });

  it("requires explicit enablement and test credentials for V2 payments", async () => {
    vi.stubEnv("LUNCHBOX_ENV", "v2");
    vi.stubEnv("ENABLE_PAYMENTS", "true");
    vi.stubEnv("RAZORPAY_KEY_ID", "rzp_test_example");
    vi.resetModules();
    const { isRazorpayConfigured } = await import("@/lib/razorpay");
    expect(isRazorpayConfigured()).toBe(true);
    vi.stubEnv("ENABLE_PAYMENTS", "false");
    vi.resetModules();
    const disabled = await import("@/lib/razorpay");
    expect(disabled.isRazorpayConfigured()).toBe(false);
  });

  it("accepts an authentic checkout signature", async () => {
    const { verifyCheckoutSignature } = await import("@/lib/razorpay");
    const signature = createHmac("sha256", "checkout-secret").update("order_123|pay_123").digest("hex");
    expect(verifyCheckoutSignature("order_123", "pay_123", signature)).toBe(true);
  });

  it("rejects a checkout signature for a different payment", async () => {
    const { verifyCheckoutSignature } = await import("@/lib/razorpay");
    const signature = createHmac("sha256", "checkout-secret").update("order_123|pay_other").digest("hex");
    expect(verifyCheckoutSignature("order_123", "pay_123", signature)).toBe(false);
  });

  it("verifies the exact raw webhook body", async () => {
    const { verifyWebhookSignature } = await import("@/lib/razorpay");
    const body = '{"event":"payment.captured","payload":{"value":39}}';
    const signature = createHmac("sha256", "webhook-secret").update(body).digest("hex");
    expect(verifyWebhookSignature(body, signature)).toBe(true);
    expect(verifyWebhookSignature(`${body}\n`, signature)).toBe(false);
  });
});
