/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../lib/api";

const LearnerContext = createContext(null);

export function LearnerProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [learnerProfile, setLearnerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");

      console.log("🔐 Auth check on mount:", {
        hasToken: !!token,
      });

      if (token) {
        try {
          const response = await authAPI.getProfile();
          const user = response.success ? response.user : response;

          console.log("✅ Auth check successful:", {
            userId: user.id,
            email: user.email,
          });

          setAuthUser({
            provider: "credentials",
            email: user.email,
            name: user.name,
            picture: null,
          });

          const profileData = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            experience: user.experience,
            skills: user.skills || [],
            interviewsPracticed: user.interviews || [],
          };

          localStorage.setItem("cachedProfile", JSON.stringify(profileData));

          setIsAuthenticated(true);
          setLearnerProfile(profileData);
        } catch (error) {
          console.error("Auth check failed:", error);

          if (
            error.message?.includes("401") ||
            error.message?.includes("Invalid token") ||
            error.message?.includes("Token has expired")
          ) {
            console.error("🔒 Token is invalid or expired - clearing session");
            localStorage.removeItem("authToken");
            localStorage.removeItem("cachedProfile");
            setIsAuthenticated(false);
            setAuthUser(null);
            setLearnerProfile(null);
          } else {
            console.warn(
              "⚠️ Server temporarily unavailable - keeping user session active",
            );

            const cachedProfile = localStorage.getItem("cachedProfile");

            if (cachedProfile) {
              const profile = JSON.parse(cachedProfile);
              setLearnerProfile(profile);
              setIsAuthenticated(true);

              setAuthUser({
                provider: "credentials",
                email: profile.email,
                name: profile.name,
                picture: null,
              });
            } else {
              try {
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split("")
                    .map(
                      (c) =>
                        `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`,
                    )
                    .join(""),
                );
                const decoded = JSON.parse(jsonPayload);

                setAuthUser({
                  provider: "credentials",
                  email: decoded.email,
                  name: decoded.name || "User",
                  picture: null,
                });
                setIsAuthenticated(true);
                setLearnerProfile({
                  id: decoded.userId,
                  name: decoded.name || "User",
                  email: decoded.email,
                  avatar: null,
                  role: null,
                  experience: null,
                  skills: [],
                  interviewsPracticed: [],
                });
              } catch (decodeError) {
                console.error("Failed to decode token:", decodeError);
                // If we can't decode the token, clear the session
                localStorage.removeItem("authToken");
                localStorage.removeItem("cachedProfile");
                setIsAuthenticated(false);
                setAuthUser(null);
                setLearnerProfile(null);
              }
            }
          }
        }
      } else {
        console.log("ℹNo authentication found - user needs to log in");
      }
      setLoading(false);
      console.log("🏁 Auth check complete:", { isAuthenticated: !!token });
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem("authToken", response.token);

      const authUserData = {
        provider: "credentials",
        email: response.user.email,
        name: response.user.name,
        picture: null,
      };

      const profileData = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        experience: response.user.experience,
        skills: response.user.skills || [],
        interviewsPracticed: [],
      };

      localStorage.setItem("cachedProfile", JSON.stringify(profileData));

      setIsAuthenticated(true);
      setAuthUser(authUserData);
      setLearnerProfile(profileData);

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password, role, experience, skills) => {
    try {
      const response = await authAPI.register(
        name,
        email,
        password,
        role,
        experience,
        skills,
      );
      console.log("Signup response:", response);
      console.log("Saving token:", response.token);
      localStorage.setItem("authToken", response.token);

      const savedToken = localStorage.getItem("authToken");
      console.log("Token saved successfully:", !!savedToken);

      const authUserData = {
        provider: "credentials",
        email: response.user.email,
        name: response.user.name,
        picture: null,
      };

      const profileData = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        experience: response.user.experience,
        skills: response.user.skills || [],
        interviewsPracticed: [],
      };

      localStorage.setItem("cachedProfile", JSON.stringify(profileData));

      setIsAuthenticated(true);
      setAuthUser(authUserData);
      setLearnerProfile(profileData);

      return { success: true };
    } catch (error) {
      console.error("Signup failed:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("cachedProfile");
    setIsAuthenticated(false);
    setAuthUser(null);
    setLearnerProfile(null);
  };

  const setProfile = (profileData) => {
    setLearnerProfile((prev) => {
      const updatedProfile = {
        ...prev,
        ...profileData,
        name: profileData?.name || prev?.name || authUser?.name || "",
        email: profileData?.email || prev?.email || authUser?.email || "",
        avatar:
          profileData?.avatar || prev?.avatar || authUser?.picture || null,
        role: profileData?.role || prev?.role || "",
        experience: profileData?.experience || prev?.experience || "",
        skills: profileData?.skills || prev?.skills || [],
      };

      return updatedProfile;
    });
  };

  const saveInterviewResult = async (interviewData) => {
    setLearnerProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        interviewsPracticed: [
          ...(prev.interviewsPracticed || []),
          {
            ...interviewData,
            date: new Date().toISOString(),
          },
        ],
      };
    });
  };

  const refreshProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await authAPI.getProfile();
      const user = response.success ? response.user : response;

      setLearnerProfile({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        experience: user.experience,
        skills: user.skills || [],
        interviewsPracticed: user.interviews || [],
      });
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  const value = {
    isAuthenticated,
    authUser,
    learnerProfile,
    loading,
    login,
    signup,
    logout,
    setProfile,
    // completeQuiz removed
    saveInterviewResult,
    refreshProfile,
  };

  return (
    <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>
  );
}

export function useLearner() {
  const context = useContext(LearnerContext);
  if (!context) {
    throw new Error("useLearner must be used within LearnerProvider");
  }
  return context;
}
