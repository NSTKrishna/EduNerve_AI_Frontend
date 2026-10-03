import { useCallback, useEffect, useState } from "react";

/**
 * Runs `load()` on mount and whenever `deps` change.
 * Returns { data, error, loading, reload }; ignores results from stale runs.
 */
export function useAsync(load, deps) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, error: null, loading: true }));
    load().then(
      (data) => !cancelled && setState({ data, error: null, loading: false }),
      (error) => !cancelled && setState({ data: null, error, loading: false }),
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { ...state, reload };
}
