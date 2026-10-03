import { cn } from "../../lib/utils"

/*
 * A sheet, not a floating card: hairline bounded, no shadow. Depth in this
 * world comes from the contrast between paper, sheet and annotation wash.
 */
function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn("flex flex-col rounded-lg border border-rule bg-sheet", className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div data-slot="card-header" className={cn("px-5 pt-5", className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-display text-base font-semibold tracking-[-0.015em] text-ink", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return <div data-slot="card-description" className={cn("mt-1 text-sm text-ink-muted", className)} {...props} />
}

function CardAction({ className, ...props }) {
  return <div data-slot="card-action" className={cn("shrink-0", className)} {...props} />
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn("px-5 py-5", className)} {...props} />
}

function CardFooter({ className, ...props }) {
  return (
    <div data-slot="card-footer" className={cn("flex items-center border-t border-rule px-5 py-4", className)} {...props} />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
