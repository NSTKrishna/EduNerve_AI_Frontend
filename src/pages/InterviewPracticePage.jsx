import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLearner } from "../context/LearnerContext";
import { content } from "../data/mockData";
import Button from "../components/common/Button";

export default function InterviewPracticePage() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const { practiceInterview } = useLearner();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [showComplete, setShowComplete] = useState(false);

  const topicContent = content[topic];

  if (!topicContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Interview prep not found
          </h1>
          <Link to="/interviews">
            <Button>Back to Interviews</Button>
          </Link>
        </div>
      </div>
    );
  }

  const interview = topicContent.interview;
  const questions = interview.questions;

  const handleResponse = (questionIndex, response) => {
    setResponses({ ...responses, [questionIndex]: response });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    practiceInterview(topic, responses);
    setShowComplete(true);
  };

  if (showComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Practice Complete!
            </h1>
            <p className="text-muted-foreground mb-8">
              Great job practicing {questions.length} interview questions!
            </p>

            <div className="bg-muted rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-foreground mb-4">
                Tips for your next interview:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Practice explaining your thought process clearly</li>
                <li>• Use specific examples from your experience</li>
                <li>• Ask clarifying questions when needed</li>
                <li>• Stay calm and take your time to think</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/interviews")}>
                Back to Interviews
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Practice Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/interviews"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back
        </Link>

        <div className="bg-white border border-border rounded-2xl p-8 shadow-xl">
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-3">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 flex-shrink-0">
                <span className="text-2xl">🎤</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {question}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Take your time to think through your answer. Practice
                  explaining your thought process clearly.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-foreground mb-3">
              Your Response
            </label>
            <textarea
              value={responses[currentQuestion] || ""}
              onChange={(e) => handleResponse(currentQuestion, e.target.value)}
              placeholder="Type your answer here..."
              rows={10}
              className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestion(Math.max(0, currentQuestion - 1))
              }
              disabled={currentQuestion === 0}
              className="px-6 disabled:opacity-50"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!responses[currentQuestion]?.trim()}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
            >
              {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
