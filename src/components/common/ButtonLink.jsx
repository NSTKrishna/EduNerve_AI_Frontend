import { Link } from "react-router-dom";
import { buttonClasses } from "./buttonStyles";

/* A router link that is visually a Button, so navigation CTAs stop retyping
   the brand styling inline. */
export default function ButtonLink({ variant = "primary", size = "md", className = "", ...props }) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
