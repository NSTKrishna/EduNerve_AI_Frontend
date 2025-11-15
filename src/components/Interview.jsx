import React, { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { useLearner } from "../context/LearnerContext";
import "../App.css";

function Interview() {
  const { learnerProfile, refreshProfile } = useLearner();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState(
    "Fill out the form to start your personalized mock interview"
  );
  const [vapiInstance, setVapiInstance] = useState(null);
  const [interviewInfo, setInterviewInfo] = useState(null);
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

    if (vapiInstance) {
      try {
        await vapiInstance.stop();
        setVapiInstance(null);
      } catch (error) {
        console.error("Error stopping previous VAPI instance:", error);
      }
    }

    try {
      setStatus("Generating your personalized interview with AI (Gemini)...");
      setTranscript([]);

      const token = localStorage.getItem("authToken");
      console.log("Token check before interview:", {
        hasToken: !!token,
        tokenLength: token?.length,
        tokenPreview: token?.substring(0, 20) + "...",
        allLocalStorage: Object.keys(localStorage),
      });
 
      if (!token) {
        setStatus("Authentication token not found. Please log in again.");
        setIsLoading(false);   
        return; 
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const res = await fetch(
        `${API_URL}/interview/start-interview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        setStatus("Invalid response from server");
        setIsLoading(false);
        return;
      }

      console.log("📡 Server response:", {
        status: res.status,
        ok: res.ok,
        data: data,
      });

      if (!res.ok) {
        if (res.status === 401) {
          setStatus("Authentication failed. Please log in again.");
          console.error("401 Error - Token might be expired or invalid");
        } else {
          setStatus(`Error: ${data?.error || "Server error"}`);
        }
        setIsLoading(false);
        return;
      }

      if (!data.success) {
        setStatus(`Error: ${data.error}`);
        setIsLoading(false);
        return;
      }

      setInterviewInfo(data.interviewConfig);
      setInterviewId(data.interviewId);
      setStep(2);

      const vapi = new Vapi(
        data.publicKey || "963b4430-fefb-4d42-bc81-78b81277cf45"
      );
      setVapiInstance(vapi);

      setStatus("🔄 Connecting to AI interviewer...");
      setIsConnected(false);

      vapi.on("call-start", () => {
        setIsConnected(true);
        setStatus(
          `🎤 ${formData.interviewType.toUpperCase()} Interview in Progress!`
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


        if (interviewId && transcript.length > 0) {
          try {
            setStatus("Saving interview data and generating feedback...");
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
            const response = await fetch(
              `${API_URL}/interview/complete`,
              {
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
              }
            );

            const data = await response.json();
            if (data.success) {
              await refreshProfile(); // Refresh profile to update dashboard
              setStatus(
                "Interview completed successfully! Check your dashboard for detailed feedback."
              );
            } else {
              setStatus("Mock interview completed. Feedback generation failed.");
            }
          } catch (error) {
            console.error("Error saving interview:", error);
            setStatus("Mock interview completed. Could not save feedback.");
          }
        } else {
          setStatus("Mock interview completed. Great job!");
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
        console.error("VAPI Error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        setStatus(
          `Error: ${error.message || "Call failed. Check console for details."}`
        );
        setIsConnected(false);
      });

      try {
        const callConfig = {
          name: `${formData.role} Interview`,
          transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "en-US",
          },
          model: {
            provider: "openai",
            model: "gpt-4o-mini",
            temperature: 0.7,
            messages: [
              {
                role: "system",
                content: data.systemPrompt,
              },
            ],
          },
          voice: {
            provider: "playht",
            voiceId: "jennifer",
          },
          firstMessage: `Hello! I'm your AI interviewer for the ${formData.role} position. I'm excited to conduct this ${formData.interviewType} interview with you today. Let's begin - please tell me a bit about yourself.`,
          endCallMessage:
            "Thank you for participating in this mock interview. You did a great job! I hope the feedback was helpful.",
          recordingEnabled: false,
        };

        await vapi.start(callConfig);
      } catch (startError) {
        console.error("Error calling vapi.start():", startError);
        setStatus(`Failed to start call: ${startError.message}`);
        setIsConnected(false);
        setIsLoading(false);
        throw startError;
      }
    } catch (err) {
      console.error(err);
      setStatus("Error starting interview. Check console for details.");
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
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        const response = await fetch(
          `${API_URL}/interview/complete`,
          {
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
          }
        );

        const data = await response.json();
        if (data.success) {
          await refreshProfile(); // Refresh profile to update dashboard
          setStatus(
            "Interview completed successfully! Check your dashboard for detailed feedback."
          );
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
    <div className="min-h-screen bg-background">
      <div
        className="App"
        style={{ padding: 20, maxWidth: "1200px", margin: "0 auto" }}
      >
        <h1>AI Mock Interview Trainer</h1>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Powered by Gemini AI + VAPI - Get personalized interview questions
          based on your role and tech stack
        </p>

        {step === 1 && (
          <div
            style={{
              background: "#f8f9fa",
              padding: "30px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>📋 Interview Configuration</h2>

            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Select Your Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                <option value="">-- Select a role --</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Interview Type *
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                {["technical", "behavioral", "mixed"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleInputChange("interviewType", type)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "6px",
                      border:
                        formData.interviewType === type
                          ? "2px solid #007bff"
                          : "1px solid #ddd",
                      background:
                        formData.interviewType === type ? "#e7f3ff" : "white",
                      cursor: "pointer",
                      fontWeight:
                        formData.interviewType === type ? "bold" : "normal",
                      textTransform: "capitalize",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {formData.role && (
              <div style={{ marginBottom: "25px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Select Technologies to Cover * (Choose at least 1)
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {techOptions[formData.role]?.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => toggleTechnology(tech)}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "20px",
                        border: formData.technologies.includes(tech)
                          ? "2px solid #28a745"
                          : "1px solid #ddd",
                        background: formData.technologies.includes(tech)
                          ? "#d4edda"
                          : "white",
                        cursor: "pointer",
                        fontWeight: formData.technologies.includes(tech)
                          ? "bold"
                          : "normal",
                      }}
                    >
                      {tech} {formData.technologies.includes(tech) && "✓"}
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
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor:
                  !formData.role ||
                  formData.technologies.length === 0 ||
                  isLoading
                    ? "#6c757d"
                    : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor:
                  !formData.role ||
                  formData.technologies.length === 0 ||
                  isLoading
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {isLoading
                ? "Generating Interview..."
                : "Generate & Start Interview"}
            </button>
          </div>
        )}

        {step === 2 && (
          <>
            {interviewInfo && (
              <div
                style={{
                  background: "#e7f3ff",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  border: "1px solid #0066cc",
                }}
              >
                <h3 style={{ margin: "0 0 10px 0", color: "#0066cc" }}>
                  📋 Your Interview: {formData.role}
                </h3>
                <p style={{ margin: "5px 0", color: "#333" }}>
                  <strong>Type:</strong> {formData.interviewType.toUpperCase()}{" "}
                  |<strong> Duration:</strong> {interviewInfo.duration} |
                  <strong> Technologies:</strong>{" "}
                  {formData.technologies.join(", ")}
                </p>
                <p style={{ margin: "5px 0", color: "#333" }}>
                  <strong>Sections:</strong>{" "}
                  {interviewInfo.sections.join(" → ")}
                </p>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "20px",
                minHeight: "400px",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    left: "15px",
                    background: isConnected ? "#10b981" : "#ef4444",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "white",
                      animation: isConnected ? "pulse 2s infinite" : "none",
                    }}
                  ></div>
                  {isConnected ? "Connected" : "Connecting..."}
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "rgba(0,0,0,0.5)",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {Math.floor(callDuration / 60)}:
                  {(callDuration % 60).toString().padStart(2, "0")}
                </div>

                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                    border: isSpeaking
                      ? "4px solid #10b981"
                      : "4px solid rgba(255,255,255,0.3)",
                    transition: "all 0.3s ease",
                    animation: isSpeaking ? "robotPulse 1s infinite" : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: "120px",
                      filter: isSpeaking
                        ? "drop-shadow(0 0 20px #10b981)"
                        : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    🤖
                  </div>
                </div>

                <h3
                  style={{
                    color: "white",
                    margin: "0 0 10px 0",
                    textAlign: "center",
                  }}
                >
                  AI Interviewer
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    margin: 0,
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  {isSpeaking
                    ? "🎙️ Speaking..."
                    : isConnected
                    ? "👂 Listening..."
                    : "⏳ Starting..."}
                </p>
              </div>

              <div
                style={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    left: "15px",
                    background: "rgba(0,0,0,0.5)",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  🎤 Your Microphone
                </div>

                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                    border: "4px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <div style={{ fontSize: "120px" }}>👤</div>
                </div>

                <h3
                  style={{
                    color: "white",
                    margin: "0 0 10px 0",
                    textAlign: "center",
                  }}
                >
                  You
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    margin: 0,
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  {isConnected
                    ? "🎙️ Speak clearly into your microphone"
                    : "⏳ Preparing..."}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <button
                onClick={stopInterview}
                style={{
                  flex: 1,
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 20px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                🛑 End Interview
              </button>
              <button
                onClick={resetForm}
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 20px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                🔄 New Interview
              </button>
            </div>

            {/* Live Transcript Display */}
            {transcript.length > 0 && (
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "20px",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 15px 0",
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>💬</span>
                  <span>Conversation Transcript</span>
                  <span
                    style={{
                      fontSize: "12px",
                      background: "#e7f3ff",
                      color: "#0066cc",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontWeight: "normal",
                    }}
                  >
                    {transcript.length} messages
                  </span>
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {transcript.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems:
                          msg.speaker === "You" ? "flex-end" : "flex-start",
                        animation: "slideIn 0.3s ease-out",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "80%",
                          background:
                            msg.speaker === "You" ? "#e7f3ff" : "#f0f0f0",
                          padding: "12px 16px",
                          borderRadius: "12px",
                          borderBottomRightRadius:
                            msg.speaker === "You" ? "4px" : "12px",
                          borderBottomLeftRadius:
                            msg.speaker === "You" ? "12px" : "4px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: msg.speaker === "You" ? "#0066cc" : "#666",
                            marginBottom: "4px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span>{msg.speaker === "You" ? "👤" : "🤖"}</span>
                          <span>{msg.speaker}</span>
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#999",
                              fontWeight: "normal",
                            }}
                          >
                            {msg.timestamp}
                          </span>
                        </div>
                        <div
                          style={{
                            color: "#333",
                            fontSize: "14px",
                            lineHeight: "1.5",
                            wordWrap: "break-word",
                          }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={transcriptEndRef} />
                </div>
              </div>
            )}
          </>
        )}

        <div
          style={{
            background: "#f6f8fa",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>Status</h3>
          <pre
            style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit" }}
          >
            {status}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default Interview;
