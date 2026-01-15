import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useLearner } from "../context/LearnerContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { Sparkles, ArrowLeft, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, loginWithGoogle, isAuthenticated } = useLearner();
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");

    if (!credentialResponse?.credential) {
      setError("Google sign-in failed. Please try again.");
      return;
    }

    const result = await loginWithGoogle(credentialResponse.credential);
    if (result.success) {
      navigate("/dashboard");
      return;
    }

    setError(result.error || "Google sign-in failed. Please try again.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      {/* Back to Home Button */}
      <Link
        to="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8 space-y-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              EduNerve AI
            </span>
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue your learning journey
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-border rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {googleClientId && (
            <div className="mt-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-muted-foreground font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google sign-in was cancelled.")}
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Protected by reCAPTCHA and subject to the{" "}
          <a href="#" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
