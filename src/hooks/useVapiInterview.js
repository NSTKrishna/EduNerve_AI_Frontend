import { useCallback, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { interviewAPI } from "../lib/api";

/**
 * Runs one live interview: Vapi call + transcript + submitting the result.
 *
 * Everything the event handlers need lives in refs (not state) because Vapi
 * callbacks are registered once and would otherwise read stale values. That
 * stale-closure problem is why feedback used to be lost when the call ended on
 * Vapi's side. There is exactly one `finish()` and it only ever runs once.
 *
 * phase: idle -> connecting -> live -> finishing -> done | failed
 *
 * start() resolves to { ok: true } once the call is set up, or { ok: false, error } if it
 * could not start (the interview is then closed and refunded automatically).
 */
export function useVapiInterview({ onFinished }) {
  const [phase, setPhase] = useState("idle");
  const [transcript, setTranscript] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState(null);

  const vapiRef = useRef(null);
  const interviewIdRef = useRef(null);
  const transcriptRef = useRef([]);
  const startedAtRef = useRef(0);
  const timerRef = useRef(null);
  const submittedRef = useRef(false); // true once a /complete request succeeded
  const submittingRef = useRef(false);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    startedAtRef.current = Date.now();
    timerRef.current = setInterval(
      () => setSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000)),
      1000,
    );
  }, [stopTimer]);

  /** Send the transcript to the backend. Safe to call repeatedly: it submits at most once. */
  const finish = useCallback(async ({ keepError = false } = {}) => {
    if (!interviewIdRef.current || submittedRef.current || submittingRef.current) return;
    submittingRef.current = true;
    stopTimer();
    setIsSpeaking(false);
    setPhase("finishing");
    if (!keepError) setError(null);

    try {
      const result = await interviewAPI.complete({
        interviewId: interviewIdRef.current,
        transcript: transcriptRef.current,
        duration: startedAtRef.current ? Math.round((Date.now() - startedAtRef.current) / 1000) : undefined,
      });
      submittedRef.current = true;
      setPhase("done");
      onFinishedRef.current?.(result);
    } catch (err) {
      if (err.code === "ALREADY_FINISHED") {
        submittedRef.current = true;
      }
      setError(err.message);
      setPhase("failed"); // transcript is kept so the user can retry
    } finally {
      submittingRef.current = false;
    }
  }, [stopTimer]);

  const start = useCallback(
    async (session) => {
      const { interviewId, publicKey, assistantConfig } = session;
      interviewIdRef.current = interviewId;
      transcriptRef.current = [];
      submittedRef.current = false;
      setTranscript([]);
      setSeconds(0);
      setError(null);
      setPhase("connecting");

      try {
        if (!publicKey) throw new Error("Voice service is not configured on the server.");
        const vapi = new Vapi(publicKey);
        vapiRef.current = vapi;

        vapi.on("call-start", () => {
          setPhase("live");
          startTimer();
        });
        vapi.on("call-end", () => finish());
        vapi.on("speech-start", () => setIsSpeaking(true));
        vapi.on("speech-end", () => setIsSpeaking(false));
        vapi.on("message", (message) => {
          if (message.type !== "transcript" || message.transcriptType !== "final") return;
          const turn = {
            speaker: message.role === "assistant" ? "Interviewer" : "You",
            text: message.transcript,
            timestamp: new Date().toISOString(),
          };
          transcriptRef.current = [...transcriptRef.current, turn];
          setTranscript(transcriptRef.current);
        });
        vapi.on("error", (event) => {
          console.error("Vapi error:", event);
          setError(event?.errorMsg || event?.error?.message || event?.message || "The voice connection failed.");
        });

        await vapi.start(assistantConfig);
        return { ok: true };
      } catch (err) {
        // The interview row exists and tokens were charged. Closing it with an empty
        // transcript makes the server mark it abandoned and refund the tokens.
        const message = err?.message || "Could not start the voice call.";
        setError(message);
        await finish({ keepError: true });
        return { ok: false, error: message };
      }
    },
    [finish, startTimer],
  );

  /** End button: stopping the call fires `call-end`, which submits. Without a live call, submit directly. */
  const stop = useCallback(async () => {
    const vapi = vapiRef.current;
    if (vapi && phase === "live") {
      vapi.stop();
      // call-end normally follows; this is a safety net if it never arrives.
      setTimeout(() => finish(), 4000);
    } else {
      await finish();
    }
  }, [finish, phase]);

  const retry = useCallback(() => finish(), [finish]);

  // Leaving the page mid-call: hang up and save what we have (best effort).
  useEffect(
    () => () => {
      stopTimer();
      try {
        vapiRef.current?.stop();
      } catch {
        /* already stopped */
      }
      if (interviewIdRef.current && !submittedRef.current && !submittingRef.current) {
        submittingRef.current = true; // keeps a late `call-end` from submitting a second time
        interviewAPI
          .complete({ interviewId: interviewIdRef.current, transcript: transcriptRef.current })
          .catch(() => {});
      }
    },
    [stopTimer],
  );

  return { phase, transcript, isSpeaking, seconds, error, start, stop, retry };
}
