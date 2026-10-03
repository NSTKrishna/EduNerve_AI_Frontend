import { useCallback, useEffect, useRef, useState } from "react";
import { interviewAPI } from "../lib/api";
import { STATUS_LABELS } from "../lib/format";
import { PageError } from "../components/common/PageState";
import InterviewRow from "../components/dashboard/InterviewRow";
import Button from "../components/common/Button";
import ButtonLink from "../components/common/ButtonLink";
import Select from "../components/common/Select";
import Skeleton from "../components/common/Skeleton";

const PAGE_SIZE = 10;

function RowSkeleton() {
  return (
    <div className="border-t border-rule py-4">
      <Skeleton className="h-4 w-52" />
      <Skeleton className="mt-2.5 h-3 w-36" />
    </div>
  );
}

export default function HistoryPage() {
  const [filters, setFilters] = useState({ status: "", interviewType: "" });
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const requestId = useRef(0); // ignore responses from an older filter selection
  const loadedOnce = useRef(false);

  const load = useCallback(
    async (nextCursor, append) => {
      const id = ++requestId.current;
      append ? setLoadingMore(true) : setLoading(true);
      setError(null);
      try {
        const page = await interviewAPI.list({
          ...filters,
          limit: PAGE_SIZE,
          cursor: nextCursor || undefined,
        });
        if (id !== requestId.current) return;
        setItems((current) => (append ? [...current, ...page.interviews] : page.interviews));
        setTotal(page.total);
        setCursor(page.nextCursor);
        loadedOnce.current = true;
      } catch (err) {
        if (id === requestId.current) setError(err);
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [filters],
  );

  useEffect(() => {
    load(null, false);
  }, [load]);

  const setFilter = (key) => (event) =>
    setFilters((current) => ({ ...current, [key]: event.target.value }));
  const filtered = Boolean(filters.status || filters.interviewType);

  // Changing a filter dims the list in place rather than replacing the page with
  // a spinner, so the thing being compared against stays on screen.
  const refiltering = loading && loadedOnce.current;
  const firstLoad = loading && !loadedOnce.current;

  return (
    <div className="mx-auto w-full max-w-[920px]">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">Interview history</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {firstLoad ? "Loading" : `${total} interview${total === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="flex gap-3">
          <Select
            aria-label="Filter by status"
            value={filters.status}
            onChange={setFilter("status")}
            className="h-10 w-auto"
          >
            <option value="">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Filter by type"
            value={filters.interviewType}
            onChange={setFilter("interviewType")}
            className="h-10 w-auto"
          >
            <option value="">All types</option>
            <option value="technical">Technical</option>
            <option value="behavioral">Behavioral</option>
            <option value="mixed">Mixed</option>
          </Select>
        </div>
      </header>

      <div className="mt-10">
        {firstLoad && (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        )}

        {!loading && error && <PageError message={error.message} onRetry={() => load(null, false)} />}

        {!loading && !error && items.length === 0 && (
          <div className="border-t border-rule py-14">
            <p className="text-sm text-ink-muted">
              {filtered
                ? "No interviews match these filters."
                : "You haven't done any interviews yet."}
            </p>
            {!filtered && (
              <div className="mt-6">
                <ButtonLink to="/interviews">Start your first interview</ButtonLink>
              </div>
            )}
          </div>
        )}

        {!error && items.length > 0 && (
          <div
            aria-busy={refiltering}
            className={refiltering ? "opacity-50 transition-opacity" : "transition-opacity"}
          >
            {items.map((interview) => (
              <InterviewRow key={interview.id} interview={interview} />
            ))}

            {cursor && (
              <div className="border-t border-rule pt-5">
                <Button variant="outline" onClick={() => load(cursor, true)} loading={loadingMore}>
                  Load more
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
