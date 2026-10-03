import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLearner } from "../context/LearnerContext";
import { useToast } from "../components/common/Toast";
import { PageError, PageLoading } from "../components/common/PageState";
import InterviewSetup from "../components/interview/InterviewSetup";
import InterviewSession from "../components/interview/InterviewSession";
import { useAsync } from "../hooks/useAsync";
import { useVapiInterview } from "../hooks/useVapiInterview";
import { interviewAPI } from "../lib/api";

export default function InterviewPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, tokens, setTokens } = useLearner();
  const options = useAsync(() => interviewAPI.getOptions(), []);

  const [session, setSession] = useState(null); // the /start-interview response
  const [starting, setStarting] = useState(false);
  const [endedEarly, setEndedEarly] = useState(null); // survives on the setup screen

  const handleFinished = useCallback(
    (result) => {
      setTokens(result.tokensRemaining);
      if (result.feedbackStatus === "none") {
        // A toast alone used to be the whole explanation, and it vanished after
        // five seconds onto a form that looked like nothing had happened.
        setEndedEarly({ refunded: result.refunded });
        setSession(null);
        return;
      }
      if (result.feedbackStatus === "fallback") {
        toast.info("Your interview was saved, but AI feedback is unavailable right now.");
      }
      navigate(`/interviews/${result.interview.id}`, { replace: true });
    },
    [navigate, setTokens, toast],
  );

  const interview = useVapiInterview({ onFinished: handleFinished });

  const handleStart = async (form) => {
    setStarting(true);
    setEndedEarly(null);
    try {
      // Ask for the microphone first so a denied prompt doesn't cost any tokens.
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        toast.error("Microphone access is needed. Allow it in your browser settings and try again.");
        return;
      }

      const started = await interviewAPI.start(form);
      setTokens(started.tokensRemaining);
      setSession(started);
      interview.start(started).then((outcome) => {
        if (!outcome.ok) toast.error(outcome.error);
      });
    } catch (error) {
      toast.error(
        error.code === "INSUFFICIENT_TOKENS"
          ? "Not enough tokens to start an interview."
          : error.message,
      );
    } finally {
      setStarting(false);
    }
  };

  if (options.loading) return <PageLoading label="Loading interview options" />;
  if (options.error) return <PageError message={options.error.message} onRetry={options.reload} />;

  return session ? (
    <InterviewSession
      session={session}
      phase={interview.phase}
      transcript={interview.transcript}
      isSpeaking={interview.isSpeaking}
      seconds={interview.seconds}
      error={interview.error}
      onStop={interview.stop}
      onRetry={interview.retry}
    />
  ) : (
    <InterviewSetup
      options={options.data}
      user={user}
      tokens={tokens}
      starting={starting}
      endedEarly={endedEarly}
      onDismissEndedEarly={() => setEndedEarly(null)}
      onStart={handleStart}
    />
  );
}
