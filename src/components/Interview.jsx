import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Vapi from "@vapi-ai/web";
import { useLearner } from "../context/LearnerContext";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const INTERVIEW_START_URL = `${API_URL}/interview/start-interview`;
const INTERVIEW_COMPLETE_URL = `${API_URL}/interview/complete`;

function Interview() {
  const navigate = useNavigate();
  const { learnerProfile, refreshProfile } = useLearner();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState(
    "Fill out the form to start your personalized mock interview",
  );
  const [vapiInstance, setVapiInstance] = useState(null);
  const [_interviewInfo, setInterviewInfo] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const transcriptEndRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const [formData, setFormData] = useState({
    userId: learnerProfile?.id || `user_${Date.now()}`,
    role: learnerProfile?.role || "",
    interviewType: "mixed",
    technologies: learnerProfile?.skills || [],
  });
  useEffect(() => {
    if (learnerProfile) {
      setFormData((prev) => ({
        ...prev,
        userId: learnerProfile.id,
        role: learnerProfile.role || prev.role,
        technologies: learnerProfile.skills || prev.technologies,
      }));
    }
  }, [learnerProfile]);

  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);

  useEffect(() => {
    const currentTimer = timerIntervalRef.current;
    return () => {
      if (vapiInstance) {
        try {
          vapiInstance.stop();
        } catch (error) {
          console.error("Error cleaning up VAPI instance:", error);
        }
      }
      if (currentTimer) {
        clearInterval(currentTimer);
      }
    };
  }, [vapiInstance]);

  const roles = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "Mobile Developer",
    "UI/UX Designer",
    "Product Manager",
    "Cloud Architect",
  ];

  const techOptions = {
    "Full Stack Developer": [
      "React",
      "Node.js",
      "MongoDB",
      "PostgreSQL",
      "Express",
      "TypeScript",
      "AWS",
    ],
    "Frontend Developer": [
      "React",
      "Vue.js",
      "Angular",
      "TypeScript",
      "Next.js",
      "CSS/SCSS",
      "Webpack",
    ],
    "Backend Developer": [
      "Node.js",
      "Python",
      "Java",
      "Go",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Microservices",
    ],
    "Data Scientist": [
      "Python",
      "R",
      "TensorFlow",
      "PyTorch",
      "Pandas",
      "SQL",
      "Machine Learning",
    ],
    "Machine Learning Engineer": [
      "Python",
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
      "Keras",
      "MLOps",
      "AWS SageMaker",
    ],
    "DevOps Engineer": [
      "Docker",
      "Kubernetes",
      "Jenkins",
      "AWS",
      "Terraform",
      "CI/CD",
      "Linux",
    ],
    "Mobile Developer": [
      "React Native",
      "Flutter",
      "Swift",
      "Kotlin",
      "iOS",
      "Android",
      "Firebase",
    ],
    "UI/UX Designer": [
      "Figma",
      "Adobe XD",
      "User Research",
      "Prototyping",
      "Design Systems",
      "Wireframing",
    ],
    "Product Manager": [
      "Product Strategy",
      "Roadmapping",
      "Analytics",
      "Agile",
      "Stakeholder Management",
    ],
    "Cloud Architect": [
      "AWS",
      "Azure",
      "GCP",
      "Serverless",
      "Microservices",
      "Cloud Security",
      "Terraform",
    ],
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "role") {
      setFormData((prev) => ({ ...prev, technologies: [] }));
    }
  };

  const toggleTechnology = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  const startInterview = async () => {
    if (!formData.role) {
      setStatus("Please select a role");
      return;
    }
    if (formData.technologies.length === 0) {
      setStatus("Please select at least one technology");
      return;
    }

    console.log("🚀 Starting interview with formData:", formData);
    setIsLoading(true);

    // Request microphone permission explicitly
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop()); // Release the microphone
    } catch (permError) {
      console.error("Microphone permission denied:", permError);
      setStatus(
        "Microphone access denied. Please allow microphone access in your browser settings to continue.",
      );
      setIsLoading(false);
      return;
    }

    if (vapiInstance) {
      try {
        await vapiInstance.stop();
        setVapiInstance(null);
      } catch (error) {
        console.error("Error stopping previous VAPI instance:", error);
      }
    }

    try {
      setStatus("Generating your personalized interview with AI (Groq)...");
      setTranscript([]);

      const token = localStorage.getItem("authToken");
      if (!token) {
        setStatus("Authentication token not found. Please log in again.");
        setIsLoading(false);
        return;
      }

      const res = await fetch(INTERVIEW_START_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        setStatus("Invalid response from server");
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        setStatus(data?.error || "Server error");
        setIsLoading(false);
        return;
      }

      setInterviewInfo(data.interviewConfig);
      setInterviewId(data.interviewId);
      setStep(2);

      // Use the key from server or fallback
      const publicKey =
        data.publicKey || "963b4430-fefb-4d42-bc81-78b81277cf45";
      console.log("Using Vapi Public Key:", publicKey);

      const vapi = new Vapi(publicKey);
      setVapiInstance(vapi);

      setStatus("🔄 Connecting to AI interviewer...");
      setIsConnected(false);

      vapi.on("call-start", () => {
        setIsConnected(true);
        setStatus(
          `🎤 ${formData.interviewType.toUpperCase()} Interview in Progress!`,
        );

        const startTime = Date.now();
        const interval = setInterval(() => {
          setCallDuration(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        timerIntervalRef.current = interval;
      });

      vapi.on("call-end", async () => {
        setIsConnected(false);
        setIsSpeaking(false);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }

        console.log("Call ended. Transcript length:", transcript.length);
        if (interviewId && transcript.length > 0) {
          try {
            setStatus("Saving interview data and generating feedback...");
            await fetch(INTERVIEW_COMPLETE_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({
                interviewId,
                transcript,
                duration: callDuration,
              }),
            })
              .then((r) => r.json())
              .then((d) => {
                if (d.success) {
                  refreshProfile();
                  setStatus(
                    "Interview completed successfully! Check your dashboard.",
                  );
                } else {
                  setStatus("Interview completed. Feedback generation failed.");
                }
              });
          } catch (e) {
            console.error(e);
            setStatus("Could not save feedback.");
          }
        } else {
          setStatus("Mock interview completed.");
        }
      });

      vapi.on("speech-start", () => {
        setIsSpeaking(true);
      });

      vapi.on("speech-end", () => {
        setIsSpeaking(false);
      });

      vapi.on("message", (msg) => {
        if (msg.type === "transcript" && msg.transcriptType === "final") {
          const speaker = msg.role === "assistant" ? "Interviewer" : "You";
          setTranscript((prev) => [
            ...prev,
            {
              speaker,
              text: msg.transcript,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      });

      vapi.on("error", (error) => {
        console.error("VAPI Error Details:", JSON.stringify(error, null, 2));
        setStatus(
          `Connection Error: ${error.errorMsg || error.message || "Unknown error"}`,
        );
        setIsConnected(false);
      });

      try {
        // Option 1: Start with a pre-configured Assistant ID if provided
        if (data.assistantId) {
          console.log(
            "Starting Vapi call with Assistant ID:",
            data.assistantId,
          );
          await vapi.start(data.assistantId);
        }
        // Option 2: Start with a minimal inline config (fallback)
        else {
          const callConfig = {
            name: `${formData.role} Interview`,
            model: {
              provider: "openai",
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    data.systemPrompt || "You are a helpful interviewer.",
                },
              ],
            },
            // Use standard 11labs voice which is widely supported
            voice: {
              provider: "11labs",
              voiceId: "paula",
            },
            firstMessage: `Hello! I'm your AI interviewer for the ${formData.role} position.`,
          };

          console.log(
            "Starting Vapi call with minimal fallback config:",
            callConfig,
          );
          await vapi.start(callConfig);
        }
      } catch (startError) {
        console.error("Error calling vapi.start():", startError);
        setStatus(`Failed to start call: ${startError.message}`);
        setIsConnected(false);
        throw startError;
      }
    } catch (err) {
      console.error(err);
      setStatus("Error starting interview. Check console.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopInterview = async () => {
    if (vapiInstance) {
      vapiInstance.stop();
      setVapiInstance(null);
    }

    if (interviewId && transcript.length > 0) {
      try {
        setStatus("Saving interview data and generating feedback...");
        const response = await fetch(INTERVIEW_COMPLETE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            interviewId,
            transcript,
            duration: callDuration,
          }),
        });

        const data = await response.json();
        if (data.success) {
          await refreshProfile(); // Refresh profile to update dashboard
          setStatus(
            "Interview completed successfully! Check your dashboard for detailed feedback.",
          );
          // Take the user back to the dashboard so they immediately see the updated stats + feedback
          navigate("/dashboard", { replace: true });
        } else {
          setStatus("Interview stopped. Feedback generation failed.");
        }
      } catch (error) {
        console.error("Error saving interview:", error);
        setStatus("Interview stopped. Could not save feedback.");
      }
    } else {
      setStatus("Interview stopped.");
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsConnected(false);
    setIsSpeaking(false);
    setCallDuration(0);
  };

  const resetForm = () => {
    if (vapiInstance) {
      vapiInstance.stop();
      setVapiInstance(null);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setStep(1);
    setFormData({
      userId: learnerProfile?.id || `user_${Date.now()}`,
      role: learnerProfile?.role || "",
      interviewType: "mixed",
      technologies: learnerProfile?.skills || [],
    });
    setTranscript([]);
    setInterviewInfo(null);
    setInterviewId(null);
    setStatus("Fill out the form to start your personalized mock interview");
    setIsConnected(false);
    setIsSpeaking(false);
    setCallDuration(0);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {step === 1 && (
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">AI Mock Interview</h1>
            <p className="text-muted-foreground">
              Configure your session and get ready to practice
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              Configuration
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Your Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="">-- Select a role --</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Interview Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["technical", "behavioral", "mixed"].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleInputChange("interviewType", type)}
                      className={`py-3 px-2 rounded-xl text-sm font-medium capitalize transition-all border ${
                        formData.interviewType === type
                          ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.02]"
                          : "bg-white text-muted-foreground border-border hover:bg-slate-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {formData.role && (
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Select Technologies{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      (Choose at least 1)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {techOptions[formData.role]?.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => toggleTechnology(tech)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                          formData.technologies.includes(tech)
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-white text-slate-600 border-border hover:bg-slate-50"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={startInterview}
                disabled={
                  !formData.role ||
                  formData.technologies.length === 0 ||
                  isLoading
                }
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? <>Starting Session...</> : <>Start Interview</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col h-full max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={stopInterview}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-lg">←</span> Back
            </button>
            <h2 className="text-xl font-bold">Mock Interview</h2>
            <div className="bg-slate-100 px-4 py-1.5 rounded-full font-mono font-medium text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              {Math.floor(callDuration / 60)}:
              {(callDuration % 60).toString().padStart(2, "0")}
            </div>
          </div>

          {/* Status Bar */}
          {!isConnected && (
            <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              {status}
            </div>
          )}

          {/* Info Card */}
          <div className="bg-white border border-border rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="font-bold text-lg">{formData.role}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {formData.interviewType} Interview •{" "}
                {formData.technologies.slice(0, 3).join(", ")}
                {formData.technologies.length > 3 &&
                  ` +${formData.technologies.length - 3}`}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${isConnected ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-600" : "bg-yellow-600 animate-pulse"}`}
              ></div>
              {isConnected ? "Active" : "Connecting..."}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-[400px]">
            {/* AI Avatar */}
            <div className="bg-white border border-border rounded-2xl flex flex-col items-center justify-center p-8 shadow-sm relative overflow-hidden group">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${isSpeaking ? "bg-blue-100 scale-110" : "bg-slate-50"}`}
              >
                <div
                  className={`text-4xl transition-all duration-300 ${isSpeaking ? "scale-110" : "scale-100"}`}
                >
                  🎙️
                </div>
              </div>

              {isSpeaking && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-40 h-40 border-4 border-blue-100 rounded-full animate-ping opacity-20"></div>
                </div>
              )}

              <h3 className="font-bold text-lg">AI Interviewer</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isSpeaking ? "Speaking..." : "Listening..."}
              </p>
            </div>

            {/* User Avatar */}
            <div className="bg-white border border-border rounded-2xl flex flex-col items-center justify-center p-8 shadow-sm">
              <div className="w-32 h-32 rounded-full bg-blue-600/10 flex items-center justify-center mb-6">
                <div className="text-4xl text-blue-600">👤</div>
              </div>
              <h3 className="font-bold text-lg">You</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Waiting to connect...
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={stopInterview}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 min-w-[200px] justify-center"
            >
              <span>End Interview</span>
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-white border border-border hover:bg-slate-50 text-foreground font-medium rounded-xl transition-all flex items-center gap-2"
            >
              <span>New</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interview;
