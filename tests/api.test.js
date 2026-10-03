import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const store = new Map();
vi.stubGlobal("localStorage", {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
});

const { ApiError, authAPI, interviewAPI, setSessionExpiredHandler } = await import("../src/lib/api.js");

const respond = (status, body) =>
  Promise.resolve({ ok: status >= 200 && status < 300, status, json: () => Promise.resolve(body) });

beforeEach(() => {
  store.clear();
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => setSessionExpiredHandler(null));

describe("request()", () => {
  it("sends the JWT and a JSON body", async () => {
    store.set("authToken", "jwt-123");
    fetch.mockReturnValue(respond(200, { success: true }));

    await authAPI.updateProfile({ name: "A" });

    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe("http://localhost:3000/api/auth/profile");
    expect(init.method).toBe("PUT");
    expect(init.headers.Authorization).toBe("Bearer jwt-123");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual({ name: "A" });
  });

  it("surfaces the backend's `error` message (not a generic HTTP status)", async () => {
    fetch.mockReturnValue(respond(401, { success: false, code: "INVALID_CREDENTIALS", error: "Invalid email or password" }));

    await expect(authAPI.login({ email: "a@b.co", password: "x" })).rejects.toMatchObject({
      name: "ApiError",
      message: "Invalid email or password",
      status: 401,
      code: "INVALID_CREDENTIALS",
    });
  });

  it("does NOT log the user out for a wrong password", async () => {
    const onExpired = vi.fn();
    setSessionExpiredHandler(onExpired);
    fetch.mockReturnValue(respond(401, { code: "INVALID_CREDENTIALS", error: "Invalid email or password" }));

    await authAPI.login({ email: "a@b.co", password: "x" }).catch(() => {});
    expect(onExpired).not.toHaveBeenCalled();
  });

  it("logs the user out when the session is invalid or expired", async () => {
    const onExpired = vi.fn();
    setSessionExpiredHandler(onExpired);
    fetch.mockReturnValue(respond(401, { code: "TOKEN_EXPIRED", error: "Token has expired. Please login again." }));

    await expect(interviewAPI.list()).rejects.toBeInstanceOf(ApiError);
    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  it("turns network failures into a NETWORK_ERROR", async () => {
    fetch.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(interviewAPI.getOptions()).rejects.toMatchObject({ code: "NETWORK_ERROR", status: 0 });
  });

  it("handles non-JSON error bodies", async () => {
    fetch.mockReturnValue(Promise.resolve({ ok: false, status: 502, json: () => Promise.reject(new Error("not json")) }));
    await expect(interviewAPI.getOptions()).rejects.toMatchObject({ status: 502, message: "Request failed (502)" });
  });

  it("builds query strings and skips empty values", async () => {
    fetch.mockReturnValue(respond(200, { interviews: [] }));
    await interviewAPI.list({ limit: 10, cursor: undefined, status: "" , interviewType: "mixed" });
    expect(fetch.mock.calls[0][0]).toBe("http://localhost:3000/api/interview/user/history?limit=10&interviewType=mixed");
  });

  it("encodes interview ids in the path", async () => {
    fetch.mockReturnValue(respond(200, {}));
    await interviewAPI.get("a/b");
    expect(fetch.mock.calls[0][0]).toContain("/interview/a%2Fb");
  });
});
