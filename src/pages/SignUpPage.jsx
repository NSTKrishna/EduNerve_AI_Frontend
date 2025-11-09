import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { UseLearner } from "../context/LearnerContext"
import Input from "../components/common/Input"
import Button from "../components/common/Button"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { signup, loginWithGoogle, isAuthenticated } = UseLearner()
  const navigate = useNavigate()
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!name || !email || !password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    const result = await signup(name, email, password, "", "", [])
    setLoading(false)
    
    if (result.success) {
      navigate("/dashboard")
    } else {
      setError(result.error || "Sign up failed. Please try again.")
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("")

    if (!credentialResponse?.credential) {
      setError("Google sign-up failed. Please try again.")
      return
    }

    const result = await loginWithGoogle(credentialResponse.credential)
    if (result.success) {
      navigate("/dashboard")
      return
    }

    setError(result.error || "Google sign-up failed. Please try again.")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Start your learning journey today</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {googleClientId && (
            <div className="mt-6">
              <div className="relative mb-5">
                <span className="absolute inset-0 flex items-center" aria-hidden="true">
                  <span className="w-full border-t border-border" />
                </span>
                <span className="relative flex justify-center text-xs uppercase text-muted-foreground">
                  <span className="bg-card px-3">Or join with</span>
                </span>
              </div>

              <div className="flex justify-center">
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google sign-up was cancelled.")} />
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
