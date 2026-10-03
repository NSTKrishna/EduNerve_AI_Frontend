import { buttonClasses } from "./buttonStyles";
import Spinner from "./Spinner";

/*
 * The one button. The primary variant is the boxed answer, so callers never
 * pass colour classes; a page with two competing primaries is a page that has
 * not decided which question it is asking.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
