---
name: EduNerve AI
description: A warm worksheet-paper interface where interview results read as your own work marked up in the margin — hairlines divide, four annotation inks carry every judgement, and one enormous figure per view carries the hierarchy.
colors:
  paper: "#fbf7ef"
  sheet: "#fffdf8"
  sunk: "#f3ede0"
  ink: "#1a1612"
  ink-muted: "#645b4e"
  ink-faint: "#776d5d"
  rule: "#e4dbca"
  rule-strong: "#cbbfa8"
  mark-red: "#b8311a"
  mark-green: "#16803c"
  mark-ochre: "#8f6512"
  mark-blue: "#3a4fb8"
  red-wash: "#fbede9"
  red-ink: "#8e2415"
  red-rule: "#f0d3cb"
  green-wash: "#e9f4ec"
  green-ink: "#0e5a2a"
  green-rule: "#cbe4d3"
  ochre-wash: "#faf2df"
  ochre-ink: "#70500c"
  ochre-rule: "#ebdcb4"
  blue-wash: "#ebedf9"
  blue-ink: "#27357f"
  blue-rule: "#d2d7ee"
  primary: "#1a1612"
  primary-ink: "#fffdf8"
  primary-hover: "#312922"
  focus: "#3a4fb8"
  chart-1: "#c8371f"
  chart-2: "#16803c"
  chart-3: "#3a4fb8"
  chart-4: "#b5801f"
  dark-paper: "#17140f"
  dark-sheet: "#201c16"
  dark-sunk: "#2a251d"
  dark-ink: "#f5efe2"
  dark-ink-muted: "#a89c88"
  dark-ink-faint: "#938876"
  dark-rule: "#39322a"
  dark-rule-strong: "#4e4539"
  dark-mark-red: "#e3705a"
  dark-mark-green: "#3fb89c"
  dark-mark-ochre: "#d4a03c"
  dark-mark-blue: "#8690f0"
  dark-red-wash: "#2e1b16"
  dark-red-ink: "#f0a896"
  dark-red-rule: "#4a2b22"
  dark-green-wash: "#132a24"
  dark-green-ink: "#85d8c0"
  dark-green-rule: "#1f4238"
  dark-ochre-wash: "#2b2112"
  dark-ochre-ink: "#e8c47e"
  dark-ochre-rule: "#453620"
  dark-blue-wash: "#1c1d33"
  dark-blue-ink: "#b3b8f5"
  dark-blue-rule: "#2e3050"
  dark-primary-ink: "#17140f"
  dark-primary-hover: "#ffffff"
  dark-focus: "#8690f0"
  dark-chart-1: "#dc6048"
  dark-chart-2: "#2fa98f"
  dark-chart-3: "#6b7be8"
  dark-chart-4: "#b5841c"
typography:
  lead-figure:
    fontFamily: "Bricolage Grotesque, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(4.5rem, 12vw, 7rem)"
    fontWeight: 600
    lineHeight: 0.85
    letterSpacing: "-0.045em"
    fontFeature: "tnum 1"
  display:
    fontFamily: "Bricolage Grotesque, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6.5vw, 4.25rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Bricolage Grotesque, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.5vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  figure-sm:
    fontFamily: "Bricolage Grotesque, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
    fontFeature: "tnum 1"
  page-title:
    fontFamily: "Bricolage Grotesque, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.14em"
  label-fine:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.14em"
  measure:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
    fontFeature: "tnum 1"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  2xl: "26px"
  full: "999px"
spacing:
  hairline: "1px"
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  margin-indent: "24px"
  gutter: "16px"
  gutter-lg: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
    typography: "{typography.body-sm}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.primary-ink}"
  button-outline:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-outline-hover:
    backgroundColor: "{colors.sunk}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    height: "40px"
  button-ghost-hover:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink}"
  button-wash:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "40px"
  button-danger:
    backgroundColor: "{colors.mark-red}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.md}"
    height: "40px"
  button-danger-outline:
    backgroundColor: "{colors.red-wash}"
    textColor: "{colors.red-ink}"
    rounded: "{rounded.md}"
    height: "40px"
  button-lg:
    height: "48px"
    padding: "0 24px"
    typography: "{typography.body-sm}"
  button-sm:
    height: "32px"
    padding: "0 12px"
  input:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "44px"
  input-label:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
  status-badge:
    backgroundColor: "{colors.green-wash}"
    textColor: "{colors.green-ink}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
    typography: "{typography.label-fine}"
  notice-info:
    backgroundColor: "{colors.blue-wash}"
    textColor: "{colors.blue-ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  notice-caution:
    backgroundColor: "{colors.ochre-wash}"
    textColor: "{colors.ochre-ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  notice-correction:
    backgroundColor: "{colors.red-wash}"
    textColor: "{colors.red-ink}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  sheet-panel:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  progress-track:
    backgroundColor: "{colors.sunk}"
    rounded: "{rounded.full}"
    height: "6px"
  avatar:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: "36px"
---

# Design System: EduNerve AI

## Overview

**Creative North Star: "The Worked Example"**

The product is a sheet of warm worksheet paper with a coach's marks in the margin. A session is not a verdict handed down from a scorecard; it is the candidate's own work, shown, and then annotated beside the evidence it refers to. Every surface is built from four materials and nothing else: the paper ground (`#fbf7ef`), the sheet that sits on it (`#fffdf8`), the sunk recess (`#f3ede0`), and hairline rules in a dried-pencil beige. Judgement arrives in saturated annotation ink — red, green, ochre, blue — used as whole-region washes and margin marks, never scattered as decorative accent.

Density is editorial rather than dashboard. There is exactly one enormous figure per view (the average score, the report score), set in the display face at up to 7rem with 0.85 leading, and everything else sits at label rank below it in 10–11px uppercase mono. That scale contrast is the only hierarchy device in play; the system has no second accent colour, no card chrome, and no shadow to fall back on. Both themes are designed, not flipped: dark is a warm near-black desk at night (`#17140f` paper, `#f5efe2` ink) that keeps the paper's temperature — never a blue-black slate.

The interface refuses the category's default arrangement of four equal stat tiles above a line chart. Where that pattern would appear, facts of different kinds are set on one ruled register line at label rank instead.

**Key Characteristics:**
- Warm paper grounds in three tones; no pure white, no pure black, in either theme.
- Four annotation inks with fixed meanings, each shipped in four parts (ink, wash, wash-ink, rule).
- Division by hairline; zero box-shadows anywhere in the build.
- One enormous display figure per view against small uppercase mono labels.
- A 1px vertical margin rule in correction red that content is written to the right of.
- Mono reserved strictly for measurement — scores, counts, references, labels.

## Colors

A warm, low-chroma paper palette carrying four saturated annotation inks that are the only colour the system permits.

### Primary
- **Boxed-Answer Ink** (`{colors.primary}`): the primary action is a boxed answer — solid ink fill, paper-coloured text. It appears once per view at most ("Start interview", "Save"). In dark it inverts to chalk on slate: the ink token is the near-white, and the label is the dark paper.

### Secondary — the four annotation marks
Each mark exists in four parts: the saturated ink for strokes and icons, a wash to fill a whole region, the ink that sits legibly on that wash, and the rule that bounds it.

- **Correction Red** (`{colors.mark-red}`): what went wrong and what to fix. Carries the margin rule, destructive actions, input error borders, the active nav icon, the caret, and the logo's margin line.
- **Tick Green** (`{colors.mark-green}`): what was right. Score band "Strong", completed status, strength annotations, the captured-turn tick on the live transcript.
- **Caution Ochre** (`{colors.mark-ochre}`): in progress, incomplete, careful. Score band "Developing", in-progress status, "Work on this" annotations, and the text-selection wash.
- **Pen Blue** (`{colors.mark-blue}`): a neutral note — the teacher's aside, and the student's own pen against the marker's. It labels the YOU speaker on every transcript, heads the "Next time" annotation, carries informational notices and toasts, and is the focus ring colour. It is the fourth mark, equal in standing to the other three.

### Tertiary — the validated chart series
- **Series 1–4** (`{colors.chart-1}` … `{colors.chart-4}`): four line hues for the score trend, with dark-theme counterparts. These are a validated artifact, not a preference: see **The Fixed Adjacency Rule** below.

### Neutral
- **Paper** (`{colors.paper}`): the page ground, body background, and the sticky header's backdrop.
- **Sheet** (`{colors.sheet}`): the written-on surface — sidebar, inputs, dialogs, tooltips, the landing specimen panel.
- **Sunk** (`{colors.sunk}`): the recess — progress tracks, avatars, hover fills, active nav item, skeletons, disabled fields.
- **Ink / Ink Muted / Ink Faint** (`{colors.ink}` / `{colors.ink-muted}` / `{colors.ink-faint}`): primary copy, secondary copy, and the faint rank for placeholders, references, metadata, and axis ticks.
- **Rule / Rule Strong** (`{colors.rule}` / `{colors.rule-strong}`): the hairline that divides sections and rows, and the heavier hairline that bounds a sheet, an input, a badge, or a chip.

### Named Rules

**The Fixed Adjacency Rule.** The chart series order is overall, technical, problem solving, communication — in that order, always. The four hues were validated for separation on the sheet ground under normal vision and under protan, deutan and tritan simulation *in that adjacency*. Reordering the series, dropping one from the middle, or reusing a chart hue outside the chart breaks the guarantee the palette was checked for.

**The Four Marks Rule.** Colour in this system is annotation, and there are exactly four annotations: red is a correction, green is a tick, ochre is a caution, blue is a note. A new meaning does not get a new hue; it gets one of these four or it gets ink. Never introduce a fifth accent.

**The Never Colour Alone Rule.** No status, score or series is identified by colour alone. A score band always ships its word ("Strong", "Developing", "Needs work", "Not scored") beside the figure; a status badge always carries its label; the trend chart carries a legend naming all four series and end-labels only the lead series, because four end-labels collapse into an unreadable stack when scores converge.

**The Wash, Not Tint Rule.** Annotation colour fills whole regions — a notice, a badge, a toast — bounded by its own rule and carrying its own legible ink. It is never sprinkled as a tint on an otherwise neutral element.

## Typography

**Display Font:** Bricolage Grotesque (variable, opsz 12–96, wght 400–800), falling back to Geist
**Body Font:** Geist (400 / 500 / 600)
**Label/Mono Font:** Geist Mono (400 / 500)

**Character:** A tight, slightly idiosyncratic grotesque carrying the big numbers and the few headlines, against a plain, highly legible UI sans and a mono that only ever counts things. Display type is set large and very tight (-0.02em to -0.045em, leading down to 0.85); labels are set small, wide and uppercase (0.08em to 0.14em). There is almost nothing in between, and that gap is the hierarchy.

### Hierarchy
- **Lead Figure** (display, 600, `clamp(4.5rem, 12vw, 7rem)`, 0.85 leading, -0.045em, tabular): the one enormous number per view. Dashboard average score. The report's score uses the same rank one step down (`clamp(4rem, 10vw, 5.5rem)`).
- **Display** (display, 600, `clamp(2.75rem, 6.5vw, 4.25rem)`, 0.98 leading, -0.04em): the landing hero headline only.
- **Headline** (display, 600, `clamp(2rem, 4.5vw, 2.75rem)` and `clamp(2.5rem, 7vw, 3.5rem)`, ~1.05 leading, -0.035em): landing closing statement; the 404 heading; the auth page title at a fixed 2.5rem.
- **Page Title** (display, 600, 1.25rem / `text-xl`, -0.02em): the single shared rank for every Operate page heading — Dashboard, History, Settings, Report, Interview setup, live session. Deliberately demoted so the lead figure is unambiguously the headline.
- **Title** (display, 600, 1.125rem / 1rem, -0.02em / -0.015em): dialog titles, settings section heads, specimen role lines.
- **Body** (Geist, 400, 1rem, ~1.6 leading, max 46–62ch): prose, transcript turns, descriptions.
- **Body Small** (Geist, 400, 0.875rem): row copy, captions, hints, nav items, button labels.
- **Label** (Geist Mono, 400, 11px, uppercase, 0.12–0.14em, ink-muted): section headings, field labels, figure labels, status words. This is the rank every section heading on an Operate page occupies.
- **Label Fine** (Geist Mono, 400, 10px, uppercase, 0.1–0.14em): transcript speaker labels, per-row band words.
- **Measure** (Geist Mono, 400/500, 0.75–1.125rem, tabular figures): scores, token counts, durations, turn counts, session references (`EN-7K42`), chart axis ticks.

### Named Rules

**The Mono Is Measurement Rule.** Geist Mono appears only where something is being counted, scored, referenced or labelled — never as a "technical" costume on prose, buttons or navigation. Everything set in mono either is a number or names one. Numbers set in mono always carry tabular figures so columns line up.

**The One Figure Rule.** Each view gets exactly one number at lead-figure rank. If a second number wants that size, it is not the view's headline and belongs at measure rank instead.

**The Demoted Title Rule.** Page headings sit at 1.25rem, below the figure they introduce. A page title never competes with the measurement it frames.

## Layout

The app is a fixed 248px sheet-coloured sidebar (fixed, off-canvas below `lg` with a scrim and Escape-to-close) against a paper main column, with a sticky 72px header at `paper/92` plus backdrop blur. Main content is padded 16px / 32px vertically on mobile and 40px at `lg`. Content columns are capped: 920px for the dashboard register, 1100px for landing and auth, 760px for landing prose lists, 420px for the auth form, and prose measures are set in characters (46ch hero, 56–62ch body, 20ch for the closing headline).

Rhythm is built on a 4px base expressed as a short set of steps actually in use: hairline (1px), 6px, 10px, 16px, 24px, 40px. Section-to-section spacing is 40px (`mt-10`, `gap-10`); within a block, 16–24px; inside a control, 10–16px. The margin indent is a constant 24px (`pl-6`) wherever the margin rule appears, 16–20px for nested annotations.

Responsive behaviour is column collapse, never layout substitution: the dashboard's figure-plus-scores pair is a two-column grid at `md` and stacks below it; the report's annotation aside is a `260px + 1fr` grid at `lg` and stacks below; the landing hero is `1.05fr + 1fr` at `lg`. The mobile header substitutes a mono uppercase route label for the sidebar, because the only other cue to location is the page h1 and that scrolls away.

**The Register Line Rule.** Facts of different kinds (interview counts, skills tracked, experience) sit on one hairline-topped register line at label rank, inline, never as a row of equally weighted stat tiles.

## Elevation & Depth

**There are no shadows in this system.** The build contains zero `box-shadow` declarations — not on cards, not on dialogs, not on the sidebar, not on hover. Depth is entirely tonal and linear: the paper ground recedes, the sheet sits on it, the sunk tone recesses into it, and annotation washes read as marks laid on top. Separation is done with 1px rules in `rule` (between rows and sections) or `rule-strong` (bounding a sheet, input, badge or chip). The modal is the only overlay, and it establishes depth with an ink scrim at 45% opacity plus a `rule-strong` border — not with a lift.

### Named Rules

**The Division Rule.** This world divides by hairline, never by drop-shadowed card. Any surface that needs to be set apart gets a rule, a change of paper tone, or an annotation wash. A shadow is never the answer, including on hover, including on the modal.

**The Sticky Header Rule.** The only depth cue permitted at scroll boundaries is a bottom hairline plus a translucent paper backdrop (`paper/92` with blur). No shadow appears as the content passes under it.

## Shapes

Corners are generous and consistently stepped: 6px (skeletons, focus outlines), 10px (buttons, inputs, selects, notices, toasts, menus, tooltips), 14px (sheet panels, dialogs — the base radius), 20px and 26px available for larger surfaces, and fully round (999px) for badges, chips, avatars, progress tracks and the scrollbar thumb. Borders are always 1px; the only non-hairline strokes in the system are the SVG logo (1.5–2px) and the chart lines (2px for the lead series, 1.25px for the rest).

The signature form is the **margin rule**: a 1px vertical line in correction red at 35–40% opacity, running the height of a block, with content written 24px to its right. It appears on the auth form, the dashboard lead figure, the sidebar nav, the landing hero, the landing specimen, the report transcript, the live session captions and the 404. Annotation blocks repeat the same device in their own mark colour at full strength.

The brand mark restates the shape at 24×24: a sheet with a 5px-radius rounded corner, a `rule-strong` stroke, a red margin line at x=7, and two rounded ink writing lines of unequal length. It is drawn as SVG rather than stacked elements so it survives at 28px.

## Components

### Buttons
- **Shape:** gently curved (10px), fixed heights of 32 / 40 / 48px, with a square 40px icon variant.
- **Primary:** the boxed answer — ink fill, paper text, 16px horizontal padding at the default 40px height. One per view.
- **Hover / Focus:** 150ms transition on background, border and opacity only; no transform, no shadow, no scale. Focus is the global 2px blue outline at 2px offset.
- **Outline:** sheet background, `rule-strong` border, hovers to sunk. **Ghost:** transparent, muted ink, hovers to a sunk fill. **Wash:** sunk fill for a quiet third rank. **Danger:** red fill with sheet text. **Danger Outline:** red wash with red ink and a red rule, used for "End interview" — a destructive action that stays legible as a mark rather than shouting as a block.
- **Disabled:** 45% opacity, pointer events off.

### Inputs / Fields
- **Style:** 44px tall, sheet background, 1px `rule-strong` border, 10px radius, 14px horizontal padding. Labels sit above in 11px uppercase mono at 0.12em in muted ink.
- **Hover:** border shifts to `ink-faint`. **Focus:** the global blue outline.
- **Error:** the border becomes correction red and a red message animates in beneath via `mark-in`; the field is `aria-invalid` and described by the message. **Disabled:** sunk fill, 70% opacity, not-allowed cursor.
- **Select** is the same field with a chevron in faint ink at 12px from the right edge and the native appearance removed.

### Status Badge
- **Style:** fully round, 1px rule, wash fill, wash ink, 11px uppercase mono at 0.08em tracking, 10px horizontal padding.
- **States:** completed is a green tick, in progress an ochre caution, abandoned ("Not finished") a neutral sunk fill with a `rule-strong` border. One state vocabulary, rendered identically everywhere it appears.

### Sheet Panels / Containers
- **Corner Style:** 14px. **Background:** sheet. **Shadow Strategy:** none — see Elevation & Depth. **Border:** 1px `rule` or `rule-strong`. **Internal Padding:** 24px.
- Most "cards" in this system are not panels at all: they are a hairline-topped block on paper (`border-t border-rule pt-5`). The bordered sheet is reserved for the landing specimen, the dialog and the chart tooltip.

### Navigation
- 248px sidebar on sheet with a `rule` right edge, a 72px logo header, and the margin rule running down the nav list with items indented to its right.
- Items are 14px Geist on a 10px radius with 12px/10px padding, muted ink by default. Active is a sunk fill, full ink, medium weight, with the item's icon in correction red; inactive icons are faint ink. Hover is a 60%-opacity sunk fill.
- Sign out sits below a top rule and hovers to the red wash with red ink.
- Mobile: a slide-in drawer (300ms ease-out transform) over an ink/45 scrim, closed by Escape, scrim click or any nav click.

### Progress / Score Bar
- A 6px fully round track in sunk with a stroke drawn along it in the score's band colour — green, ochre or red — widening over 700ms ease-out. The track is the ruled line; the stroke is the mark over it.
- The score line above it pairs the subject label in body-small ink with the band word in 11px uppercase mono and the figure in tabular mono tinted to the band.

### Dialog
- Centred (bottom-sheet aligned below `sm`) on a 14px-radius sheet panel with a `rule-strong` border and 24px padding, over an ink/45 scrim, entering with `mark-in`. Title in display 1.125rem, description in muted body-small, a ghost icon button to close, and footer actions right-aligned with 8px gaps. Escape closes; focus is trapped while open and returned to the opener on close.

### Toasts / Notices
- Bottom-right, max 384px, 10px radius, wash fill with its matching rule and ink, a 16px lucide icon, and a 14px message. Success is a tick, error a correction, info a pen-blue note. Each enters with `mark-in`.
- Inline notices (report, settings) use the same wash/rule/ink triplet at 16px/12px padding with no icon.

### The Margin Annotation (signature)
A block indented 16–24px with a 1px vertical rule in its own mark colour running its full height, headed by a 11px uppercase mono title with a 14px icon in the mark colour, carrying a list of 14px lines in full ink. Green heads "What worked", ochre "Work on this", blue "Next time". On the report these sit in a sticky aside beside the transcript they refer to, never stacked above it as a verdict — and the heading states that the marks cover the session as a whole, because the data carries no per-turn attribution.

### The Score Trend Chart (signature)
A hairline-topped block with a mono label heading and the sampled range stated in words ("showing 4–9 of a 0–10 scale"), because a fixed 0–10 axis squeezed every line into a fifth of the plot and read as flat. Horizontal grid lines only, in `rule`; no vertical grid, no axis line on Y; ticks in 11px mono faint ink. Four `monotone` lines, no dots, no entry animation, lead series at 2px and the rest at 1.25px. A legend above names all four; only the lead series is end-labelled. The tooltip is a sheet panel with a mono timestamp and a label/value list, each row prefixed by a 2px colour swatch.

### Motion
- **`mark-in`** (`mark-settle`, 500ms, `cubic-bezier(0.16, 1, 0.3, 1)`): opacity plus a 2px settle plus a left-to-right clip reveal. The world's only entrance — a mark drawn beside the thing it refers to, settling rather than sliding. Used on score bands, field errors, toasts, dialogs, menus and new transcript turns.
- **`ink-breathe`** (2400ms, `cubic-bezier(0.4, 0, 0.6, 1)`, infinite): opacity 1 → 0.35 → 1, for the connecting state on the live session.
- State transitions are 150ms on colour only. `prefers-reduced-motion: reduce` collapses all animation, transition and scroll behaviour.

### Browser Surfaces
The system claims the chrome too: selection is an ochre wash with ink text, the caret is correction red, `accent-color` is pen blue, the scrollbar is an 11px `rule-strong` thumb with a 3px paper border and round ends, links carry a 1px underline at 0.2em offset, and `:focus-visible` is a 2px blue outline at 2px offset with a 2px radius.

## Do's and Don'ts

### Do:
- **Do** divide with a hairline — `rule` between rows and sections, `rule-strong` to bound a surface.
- **Do** give each view exactly one lead figure, in the display face at `clamp(4.5rem, 12vw, 7rem)` with tabular numerals, and demote the page title to 1.25rem beneath it.
- **Do** use the four marks for their fixed meanings: red corrects, green ticks, ochre cautions, blue notes.
- **Do** ship the word beside the colour — band labels, status labels, a legend naming every chart series.
- **Do** reach for the margin rule (1px, `mark-red` at 35–40%, content 24px to its right) when a block is the user's own work being shown.
- **Do** keep Geist Mono for measurement — scores, counts, durations, references, labels — with tabular figures.
- **Do** fill a whole region with a mark's wash, bounded by its rule and carrying its wash-ink.
- **Do** design the dark theme as a warm night desk (`#17140f` / `#201c16`), keeping the paper's temperature.

### Don't:
- **Don't** add a `box-shadow` anywhere, including hover and the modal. The build has none and the whole look rests on that.
- **Don't** introduce a fifth accent hue, or reuse a chart series colour outside the chart.
- **Don't** reorder, re-hue, or drop a series from the trend chart — the palette was validated in that adjacency for protan/deutan/tritan separation.
- **Don't** arrange facts as a row of equally weighted stat tiles above a chart; use the register line at label rank.
- **Don't** set prose, buttons or navigation in mono to look technical.
- **Don't** put a second number at lead-figure rank in the same view.
- **Don't** animate by sliding, scaling or lifting; the entrance is `mark-in`, which settles.
- **Don't** make dark mode a cool slate or an inverted sheet, and don't use pure white or pure black in either theme.
