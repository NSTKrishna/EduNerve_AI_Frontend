// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { instances, complete } = vi.hoisted(() => ({ instances: [], complete: vi.fn() }));

vi.mock("@vapi-ai/web", () => ({
  default: class FakeVapi {
    handlers = {};
    constructor(key) {
      this.key = key;
      instances.push(this);
    }
    on(event, handler) {
      this.handlers[event] = handler;
    }
    emit(event, payload) {
      this.handlers[event]?.(payload);
    }
    start = vi.fn(async () => {});
    // Hanging up fires `call-end`, like the real SDK.
    stop = vi.fn(() => this.emit("call-end"));
  },
}));

vi.mock("../src/lib/api.js", () => ({ interviewAPI: { complete } }));

const { useVapiInterview } = await import("../src/hooks/useVapiInterview.js");

const session = { interviewId: "i-1", publicKey: "pk", assistantConfig: { name: "x" } };
const say = (vapi, role, transcript) =>
  act(() => vapi.emit("message", { type: "transcript", transcriptType: "final", role, transcript }));

const setup = async () => {
  const onFinished = vi.fn();
  const hook = renderHook(() => useVapiInterview({ onFinished }));
  await act(() => hook.result.current.start(session));
  const vapi = instances.at(-1);
  act(() => vapi.emit("call-start"));
  return { ...hook, vapi, onFinished };
};

beforeEach(() => {
  instances.length = 0;
  complete.mockReset();
  complete.mockResolvedValue({ interview: { id: "i-1" }, feedbackStatus: "ai", tokensRemaining: 90 });
});

describe("useVapiInterview", () => {
  it("starts the call with the server's assistant config", async () => {
    const { vapi, result } = await setup();
    expect(vapi.key).toBe("pk");
    expect(vapi.start).toHaveBeenCalledWith(session.assistantConfig);
    expect(result.current.phase).toBe("live");
  });

  it("saves the transcript when Vapi ends the call on its own (the old stale-closure bug)", async () => {
    const { vapi, onFinished } = await setup();
    say(vapi, "assistant", "Tell me about yourself");
    say(vapi, "user", "I build web apps");

    await act(async () => vapi.emit("call-end"));

    expect(complete).toHaveBeenCalledTimes(1);
    expect(complete.mock.calls[0][0]).toMatchObject({
      interviewId: "i-1",
      transcript: [
        { speaker: "Interviewer", text: "Tell me about yourself" },
        { speaker: "You", text: "I build web apps" },
      ],
    });
    expect(onFinished).toHaveBeenCalledWith(expect.objectContaining({ tokensRemaining: 90 }));
  });

  it("ignores partial transcripts", async () => {
    const { vapi } = await setup();
    act(() => vapi.emit("message", { type: "transcript", transcriptType: "partial", role: "user", transcript: "hel" }));
    await act(async () => vapi.emit("call-end"));
    expect(complete.mock.calls[0][0].transcript).toEqual([]);
  });

  it("submits exactly once when the user presses End (stop -> call-end)", async () => {
    const { vapi, result } = await setup();
    say(vapi, "user", "hello");

    await act(async () => {
      await result.current.stop();
    });

    expect(vapi.stop).toHaveBeenCalled();
    expect(complete).toHaveBeenCalledTimes(1);
    expect(result.current.phase).toBe("done");
  });

  it("closes the interview (so the server refunds it) when the call cannot start", async () => {
    const onFinished = vi.fn();
    const hook = renderHook(() => useVapiInterview({ onFinished }));
    const original = instances.length;
    let outcome;
    await act(async () => {
      outcome = await hook.result.current.start({ ...session, publicKey: null });
    });

    expect(instances.length).toBe(original); // never constructed
    expect(complete).toHaveBeenCalledWith(expect.objectContaining({ interviewId: "i-1", transcript: [] }));
    expect(outcome).toMatchObject({ ok: false, error: expect.stringMatching(/not configured/i) });
    expect(hook.result.current.error).toMatch(/not configured/i);
  });

  it("keeps the transcript and allows a retry when saving fails", async () => {
    complete.mockRejectedValueOnce(new Error("boom"));
    const { vapi, result, onFinished } = await setup();
    say(vapi, "user", "important answer");

    await act(async () => vapi.emit("call-end"));
    expect(result.current.phase).toBe("failed");
    expect(result.current.error).toBe("boom");
    expect(onFinished).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.retry();
    });
    expect(complete).toHaveBeenCalledTimes(2);
    expect(complete.mock.calls[1][0].transcript).toHaveLength(1);
    expect(result.current.phase).toBe("done");
    expect(onFinished).toHaveBeenCalledTimes(1);
  });

  it("does not submit twice after success", async () => {
    const { vapi } = await setup();
    await act(async () => vapi.emit("call-end"));
    await act(async () => vapi.emit("call-end"));
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it("saves what it has when the user leaves the page mid-call", async () => {
    const { vapi, unmount } = await setup();
    say(vapi, "user", "partial");
    unmount();
    expect(vapi.stop).toHaveBeenCalled();
    expect(complete).toHaveBeenCalledTimes(1); // despite the late `call-end` from stop()
  });
});
