import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { useLearner } from "../context/LearnerContext";
import { useToast } from "../components/common/Toast";
import { useAsync } from "../hooks/useAsync";
import { authAPI, interviewAPI, tokenAPI } from "../lib/api";
import { formatDateTime } from "../lib/format";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Select from "../components/common/Select";
import Button from "../components/common/Button";
import Dialog from "../components/common/Dialog";

const EXPERIENCE_LEVELS = ["Student / Fresher", "0-1 years", "1-3 years", "3-5 years", "5+ years"];
const MAX_SKILLS = 20;

const REASON_LABELS = {
  SIGNUP_GRANT: "Welcome bonus",
  INTERVIEW_START: "Interview",
  INTERVIEW_REFUND: "Refund",
  ADMIN_ADJUSTMENT: "Adjustment",
};

// Keeps a value that predates the fixed list (e.g. "2 years") selectable.
const withCurrent = (list, current) => (current && !list.includes(current) ? [current, ...list] : list);

/* Each concern is its own ruled section rather than a stack of equal cards. */
function Section({ title, description, children }) {
  return (
    <section className="border-t border-rule pt-8">
      <div className="mb-6">
        <h2 className="font-display text-base font-semibold tracking-[-0.015em] text-ink">{title}</h2>
        {description && <p className="mt-1.5 max-w-[56ch] text-sm text-ink-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function ProfileForm({ user, roles }) {
  const { updateProfile } = useLearner();
  const toast = useToast();
  const [form, setForm] = useState({
    name: user.name,
    role: user.role || "",
    experience: user.experience || "",
    skills: user.skills,
  });
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  const suggestions = (roles[form.role] || []).filter((skill) => !form.skills.includes(skill));

  const addSkill = (raw) => {
    const skill = raw.trim().slice(0, 40);
    if (!skill || form.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) return;
    if (form.skills.length >= MAX_SKILLS) {
      toast.error(`You can track up to ${MAX_SKILLS} skills.`);
      return;
    }
    setForm((f) => ({ ...f, skills: [...f.skills, skill] }));
    setSkillInput("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: form.name.trim(),
        role: form.role,
        experience: form.experience,
        skills: form.skills,
      });
      toast.success("Profile saved");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title="Profile" description="Used to pre-fill your interviews, so the questions match the job you want.">
      <form onSubmit={submit} className="max-w-[520px] space-y-5">
        <Input
          label="Name"
          value={form.name}
          maxLength={80}
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input label="Email" value={user.email} disabled readOnly />

        <Select
          label="Target role"
          id="profile-role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="">Not set</option>
          {withCurrent(Object.keys(roles), user.role).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </Select>

        <Select
          label="Experience"
          id="profile-exp"
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
        >
          <option value="">Not set</option>
          {withCurrent(EXPERIENCE_LEVELS, user.experience).map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>

        <div>
          <div className="flex gap-2">
            <Input
              id="skill-input"
              label="Skills"
              value={skillInput}
              placeholder="Add a skill and press Enter"
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(skillInput);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="mt-[26px] h-11 w-11"
              onClick={() => addSkill(skillInput)}
              aria-label="Add skill"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {form.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-full border border-rule-strong px-3 py-1 text-sm text-ink"
                >
                  {skill}
                  <button
                    type="button"
                    aria-label={`Remove ${skill}`}
                    className="text-ink-faint transition-colors hover:text-mark-red"
                    onClick={() =>
                      setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }))
                    }
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">
                Suggested
              </span>
              {suggestions.slice(0, 6).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  className="rounded-full border border-dashed border-rule-strong px-2.5 py-1 text-xs text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
                >
                  + {skill}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" loading={saving} disabled={!form.name.trim()}>
          Save changes
        </Button>
      </form>
    </Section>
  );
}

function PasswordForm() {
  const toast = useToast();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const mismatch = Boolean(form.confirm) && form.next !== form.confirm;

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: form.current, newPassword: form.next });
      setForm({ current: "", next: "", confirm: "" });
      toast.success("Password updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title="Password">
      <form onSubmit={submit} className="max-w-[520px] space-y-5">
        <PasswordInput
          label="Current password"
          autoComplete="current-password"
          required
          value={form.current}
          onChange={(e) => setForm({ ...form, current: e.target.value })}
        />
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          minLength={8}
          required
          hint="At least 8 characters."
          value={form.next}
          onChange={(e) => setForm({ ...form, next: e.target.value })}
        />
        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          required
          error={mismatch ? "Passwords don't match" : undefined}
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
        <Button
          type="submit"
          loading={saving}
          disabled={mismatch || form.next.length < 8 || !form.current}
        >
          Update password
        </Button>
      </form>
    </Section>
  );
}

function TokenLedger({ tokens }) {
  const { data, loading, error } = useAsync(() => tokenAPI.getTransactions(20), [tokens]);

  return (
    <Section
      title="Tokens"
      description="An interview costs 10 tokens, refunded automatically if you end one before answering."
    >
      <p className="mb-6 flex items-baseline gap-3">
        <span className="tabular font-display text-[2.5rem] font-semibold leading-none tracking-[-0.03em] text-ink">
          {tokens ?? "--"}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
          remaining
        </span>
      </p>

      {/* Stated plainly rather than pointing somewhere that cannot help. */}
      <p className="mb-6 max-w-[56ch] rounded-md border border-blue-rule bg-blue-wash px-4 py-3 text-sm text-blue-ink">
        There&apos;s no way to buy more tokens yet. When your balance runs out, that&apos;s the end
        of practice for now — we&apos;ll add top-ups before it becomes a problem.
      </p>

      {loading && <p className="text-sm text-ink-muted">Loading history</p>}
      {error && <p className="text-sm text-mark-red">{error.message}</p>}
      {data && data.transactions.length === 0 && (
        <p className="text-sm text-ink-muted">No activity yet.</p>
      )}
      {data && data.transactions.length > 0 && (
        <ul className="max-w-[520px]">
          {data.transactions.map((t) => (
            <li key={t.id} className="flex items-baseline justify-between gap-4 border-t border-rule py-3">
              <span className="text-sm text-ink">{REASON_LABELS[t.reason] || t.reason}</span>
              <span className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] text-ink-faint">
                  {formatDateTime(t.createdAt)}
                </span>
                <span
                  className={`tabular w-12 text-right font-mono text-sm ${
                    t.delta > 0 ? "text-mark-green" : "text-ink-muted"
                  }`}
                >
                  {t.delta > 0 ? "+" : ""}
                  {t.delta}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function DangerZone() {
  const { logout } = useLearner();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  const remove = async (event) => {
    event.preventDefault();
    setDeleting(true);
    try {
      await authAPI.deleteAccount(password);
      logout();
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message);
      setDeleting(false);
    }
  };

  return (
    <Section
      title="Delete account"
      description="Permanently removes your profile, interviews and token history. This can't be undone."
    >
      <Button variant="dangerOutline" onClick={() => setOpen(true)}>
        Delete my account
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete your account?"
        description="Every interview, transcript and token record goes with it. There is no undo."
      >
        <form onSubmit={remove} className="space-y-4">
          <PasswordInput
            label="Confirm with your password"
            autoComplete="current-password"
            required
            data-autofocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" loading={deleting} disabled={!password}>
              Permanently delete
            </Button>
          </div>
        </form>
      </Dialog>
    </Section>
  );
}

export default function SettingsPage() {
  const { user, tokens } = useLearner();
  const options = useAsync(() => interviewAPI.getOptions(), []);

  return (
    <div className="mx-auto w-full max-w-[920px]">
      <h1 className="mb-10 font-display text-xl font-semibold tracking-[-0.02em] text-ink">Settings</h1>

      <div className="space-y-12">
        {/* Keyed on the loaded options so initial state is built once they exist. */}
        <ProfileForm
          key={options.data ? "ready" : "loading"}
          user={user}
          roles={options.data?.roles || {}}
        />
        <TokenLedger tokens={tokens} />
        <PasswordForm />
        <DangerZone />
      </div>
    </div>
  );
}
