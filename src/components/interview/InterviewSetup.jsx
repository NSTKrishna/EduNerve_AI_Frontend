import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Select from "../common/Select";
import Button from "../common/Button";

const TYPE_HINTS = {
  technical: "Questions about your stack",
  behavioral: "Teamwork and past experience",
  mixed: "A bit of both",
};

/*
 * The question paper, filled in before the exam starts. Each choice is a
 * numbered line on the sheet; the submit is the boxed answer at the foot.
 */
function Field({ step, label, hint, children }) {
  return (
    <fieldset className="border-t border-rule py-6">
      <legend className="sr-only">{label}</legend>
      <div className="flex gap-5">
        <span aria-hidden="true" className="tabular pt-0.5 font-mono text-[11px] text-ink-faint">
          {String(step).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">{label}</p>
          {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </fieldset>
  );
}

export default function InterviewSetup({ options, user, tokens, starting, onStart }) {
  const roles = useMemo(() => Object.keys(options.roles), [options]);

  // Pre-fill from the profile, but only with values the server will accept.
  const [role, setRole] = useState(() => (roles.includes(user?.role) ? user.role : ""));
  const [interviewType, setInterviewType] = useState("mixed");
  const [technologies, setTechnologies] = useState(() => {
    const allowed = options.roles[user?.role] || [];
    return (user?.skills || []).filter((skill) => allowed.includes(skill)).slice(0, options.maxTechnologies);
  });

  const available = options.roles[role] || [];
  const canAfford = tokens === null || tokens >= options.tokenCost;
  const ready = role && technologies.length > 0 && canAfford && !starting;

  const changeRole = (next) => {
    setRole(next);
    setTechnologies([]);
  };

  const toggleTechnology = (tech) =>
    setTechnologies((current) => {
      if (current.includes(tech)) return current.filter((t) => t !== tech);
      return current.length >= options.maxTechnologies ? current : [...current, tech];
    });

  return (
    <div className="mx-auto w-full max-w-[920px]">
      <h1 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">AI mock interview</h1>
      <p className="mt-3 text-ink-muted">
        {options.durationMinutes} minutes, spoken aloud, built from the stack you choose below.
      </p>

      <form
        className="mt-10 max-w-[640px]"
        onSubmit={(event) => {
          event.preventDefault();
          if (ready) onStart({ role, interviewType, technologies });
        }}
      >
        <Field step={1} label="Role">
          <Select
            id="role"
            value={role}
            onChange={(event) => changeRole(event.target.value)}
            aria-label="Role"
          >
            <option value="">Select a role</option>
            {roles.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </Field>

        <Field step={2} label="Interview type">
          <div className="grid gap-2 sm:grid-cols-3">
            {options.interviewTypes.map((type) => {
              const selected = interviewType === type;
              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setInterviewType(type)}
                  className={`rounded-md border px-3 py-3 text-left transition-colors ${
                    selected
                      ? "border-ink bg-sunk"
                      : "border-rule-strong bg-sheet hover:border-ink-faint"
                  }`}
                >
                  <span className="block text-sm capitalize text-ink">{type}</span>
                  <span className="mt-0.5 block text-xs text-ink-muted">{TYPE_HINTS[type]}</span>
                </button>
              );
            })}
          </div>
        </Field>

        {role && (
          <Field
            step={3}
            label="Technologies"
            hint={`Pick 1 to ${options.maxTechnologies}. These become the questions you are asked.`}
          >
            <div className="flex flex-wrap gap-2">
              {available.map((tech) => {
                const selected = technologies.includes(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleTechnology(tech)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                      selected
                        ? "border-green-rule bg-green-wash text-green-ink"
                        : "border-rule-strong bg-sheet text-ink-muted hover:border-ink-faint hover:text-ink"
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">
              {technologies.length} of {options.maxTechnologies} chosen
            </p>
          </Field>
        )}

        <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-rule py-5 text-sm">
          <span className="text-ink-muted">
            Costs <span className="tabular font-mono text-ink">{options.tokenCost}</span> tokens,
            refunded if you do not speak
          </span>
          <span className="tabular font-mono text-xs text-ink-faint">
            {tokens ?? "--"} available
          </span>
        </div>

        {!canAfford && (
          <p className="mb-5 rounded-md border border-ochre-rule bg-ochre-wash px-4 py-3 text-sm text-ochre-ink">
            You need {options.tokenCost} tokens and have {tokens}. There is no way to buy more yet —
            your balance and its history are in{" "}
            <Link to="/settings" className="underline">
              Settings
            </Link>
            .
          </p>
        )}

        <Button type="submit" size="lg" disabled={!ready} loading={starting} className="w-full">
          {starting ? "Preparing your interview" : "Start interview"}
        </Button>
      </form>
    </div>
  );
}
