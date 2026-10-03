import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLearner } from "../context/LearnerContext";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import FormError from "../components/common/FormError";
import Button from "../components/common/Button";

const MIN_PASSWORD = 8;

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup, isAuthenticated } = useLearner();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  // Shown as the user types rather than only after a failed submit.
  const tooShort = touchedPassword && form.password.length > 0 && form.password.length < MIN_PASSWORD;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Fill in every field to create your account.");
      return;
    }
    if (form.password.length < MIN_PASSWORD) {
      setError(`Your password needs at least ${MIN_PASSWORD} characters.`);
      return;
    }

    setLoading(true);
    const result = await signup(form);
    setLoading(false);

    if (result.success) navigate("/dashboard");
    else setError(result.error || "We couldn't create your account. Please try again.");
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Your first interviews are on us"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-ink underline underline-offset-4 hover:text-mark-red">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Jane Doe"
          maxLength={80}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <PasswordInput
          label="Password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          hint={`At least ${MIN_PASSWORD} characters.`}
          error={tooShort ? `At least ${MIN_PASSWORD} characters.` : undefined}
          value={form.password}
          onBlur={() => setTouchedPassword(true)}
          onChange={(e) => {
            setTouchedPassword(true);
            setForm({ ...form, password: e.target.value });
          }}
        />
        <FormError message={error} />
        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
