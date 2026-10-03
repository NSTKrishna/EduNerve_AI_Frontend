import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Button from "./Button";

/* The icon shows the action, not the current state, so it agrees with the label. */
export default function ThemeToggle({ className = "" }) {
  const { isDark, toggle } = useTheme();
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <Button variant="ghost" size="icon" onClick={toggle} className={className} aria-label={label} title={label}>
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
