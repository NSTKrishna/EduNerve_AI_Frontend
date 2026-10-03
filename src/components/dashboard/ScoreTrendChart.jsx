import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate } from "../../lib/format";

/*
 * Series order is fixed and so are the hues: the palette was validated for
 * normal vision and for protan/deutan/tritan separation against the sheet in
 * both themes, and reordering would break the adjacency it was checked on.
 *
 * All four end-labels collided into an unreadable stack when the series
 * converge, which they do whenever someone is improving evenly. A legend names
 * every series, and only the lead series is labelled at its line end.
 */
const SERIES = [
  { key: "overall", label: "Overall", color: "var(--chart-1)", width: 2 },
  { key: "technical", label: "Technical", color: "var(--chart-2)", width: 1.25 },
  { key: "problemSolving", label: "Problem solving", color: "var(--chart-3)", width: 1.25 },
  { key: "communication", label: "Communication", color: "var(--chart-4)", width: 1.25 },
];

const shortDate = (value) => formatDate(value, { day: "numeric", month: "short" });

/*
 * The axis is zoomed to the band the scores actually occupy. A fixed 0-10 axis
 * squeezed every line into a fifth of the plot and read as flat, so the scale
 * is stated in words instead of spent on empty space.
 */
function bandFor(data) {
  const values = data.flatMap((point) =>
    SERIES.map(({ key }) => point[key]).filter((v) => typeof v === "number"),
  );
  if (!values.length) return [0, 10];
  const lo = Math.max(0, Math.floor(Math.min(...values) - 0.5));
  const hi = Math.min(10, Math.ceil(Math.max(...values) + 0.5));
  return hi - lo < 2 ? [Math.max(0, hi - 2), hi] : [lo, hi];
}

function TrendTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;

  return (
    <div className="rounded-md border border-rule-strong bg-sheet px-3 py-2.5">
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">{point?.when}</p>
      <ul className="mt-2 space-y-1">
        {SERIES.map(({ key, label, color }) => {
          const entry = payload.find((item) => item.dataKey === key);
          if (!entry || entry.value == null) return null;
          return (
            <li key={key} className="flex items-center justify-between gap-6 text-xs">
              <span className="flex items-center gap-2 text-ink-muted">
                <span aria-hidden="true" className="h-[2px] w-3" style={{ background: color }} />
                {label}
              </span>
              <span className="tabular font-mono text-ink">{entry.value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function ScoreTrendChart({ trend }) {
  const data = trend.map((point) => ({
    ...point,
    name: shortDate(point.date),
    when: formatDate(point.date),
  }));

  if (data.length < 2) {
    return (
      <div className="border-t border-rule py-10">
        <p className="text-sm text-ink-muted">
          Two scored interviews are enough to draw the line. You have {data.length}.
        </p>
      </div>
    );
  }

  const [low, high] = bandFor(data);

  return (
    <div className="border-t border-rule pt-5">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
          Score trend
        </h2>
        <p className="text-xs text-ink-faint">
          {data.length} scored sessions · showing {low}–{high} of a 0–10 scale
        </p>
      </div>

      <ul className="mb-5 flex flex-wrap gap-x-5 gap-y-2">
        {SERIES.map(({ key, label, color }) => (
          <li key={key} className="flex items-center gap-2 text-xs text-ink-muted">
            <span
              aria-hidden="true"
              className="h-[2px] w-4 rounded-full"
              style={{ background: color }}
            />
            {label}
          </li>
        ))}
      </ul>

      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={data} margin={{ top: 6, right: 56, bottom: 0, left: -18 }}>
          <CartesianGrid stroke="var(--rule)" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "var(--ink-faint)", fontFamily: "var(--font-mono)" }}
            axisLine={{ stroke: "var(--rule)" }}
            tickLine={false}
          />
          <YAxis
            domain={[low, high]}
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "var(--ink-faint)", fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<TrendTooltip />} cursor={{ stroke: "var(--ink-faint)", strokeWidth: 1 }} />
          {SERIES.map(({ key, label, color, width }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={label}
              stroke={color}
              strokeWidth={width}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              connectNulls
              isAnimationActive={false}
              label={
                key === "overall"
                  ? ({ x, y, index }) =>
                      index === data.length - 1 ? (
                        <text
                          key={key}
                          x={x + 9}
                          y={y}
                          dy={4}
                          fill={color}
                          fontSize={11}
                          fontFamily="var(--font-mono)"
                        >
                          {label}
                        </text>
                      ) : null
                  : undefined
              }
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
