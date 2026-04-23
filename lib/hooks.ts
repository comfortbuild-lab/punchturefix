"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

/**
 * Generic data-fetching hook with loading/error state.
 * Designed for dashboard pages that pull data from the backend on mount.
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: any[] = []
): { data: T | null; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [tick, setTick]       = useState(0);

  const refetch = () => setTick(t => t + 1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then(res => { if (!cancelled) setData(res); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);

  return { data, loading, error, refetch };
}

/** Short-polling hook — refreshes every `intervalMs` ms */
export function useLiveApi<T>(
  fetcher: () => Promise<T>,
  intervalMs = 5000
): ReturnType<typeof useApi<T>> {
  const result = useApi<T>(fetcher);
  useEffect(() => {
    const id = setInterval(result.refetch, intervalMs);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs]);
  return result;
}
