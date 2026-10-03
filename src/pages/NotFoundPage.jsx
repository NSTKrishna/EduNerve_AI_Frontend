import Logo from "../components/brand/Logo";
import ButtonLink from "../components/common/ButtonLink";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex h-[72px] shrink-0 items-center px-4 sm:px-8">
        <Logo size="sm" />
      </header>

      <main id="main" tabIndex={-1} className="flex flex-1 items-center px-4 sm:px-8">
        <div className="relative mx-auto w-full max-w-[560px] pl-6">
          <span aria-hidden="true" className="absolute inset-y-1 left-0 w-px bg-mark-red/40" />
          <h1 className="font-display text-[clamp(2.5rem,7vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-4 max-w-[48ch] text-ink-muted">
            The link may be out of date, or the page may have moved. Your interviews are all still
            in your history.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/dashboard">Go to dashboard</ButtonLink>
            <ButtonLink to="/" variant="outline">
              Back to home
            </ButtonLink>
          </div>
        </div>
      </main>
    </div>
  );
}
