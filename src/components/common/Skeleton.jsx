import { cn } from "../../lib/utils";

/* Holds the page's shape while data loads. Breathes in the world's grammar
   rather than with Tailwind's stock pulse. */
export default function Skeleton({ className = "" }) {
  return <div aria-hidden="true" className={cn("ink-breathe rounded-sm bg-sunk", className)} />;
}
