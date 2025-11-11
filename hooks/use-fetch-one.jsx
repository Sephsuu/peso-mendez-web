import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Fetches a single item using an async function.
 * Automatically handles loading, error, and cleanup.
 *
 * @param {Function} fetchFn - The async fetch function.
 * @param {Array} deps - Optional dependencies to trigger re-fetch.
 * @param {Array} args - Arguments to pass to the fetch function.
 * @returns {{ data: any, loading: boolean, error: string|null }}
 */
export function useFetchOne(fetchFn, deps = [], args = []) {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                setLoading(true);
                const result = await fetchFn(...args);
                if (isMounted) setItem(result);
            } catch (err) {
                const message = err?.message || "Failed to fetch data";
                setError(message);
                toast.error(message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [...args, ...deps]);

    return { data: item, loading, error };
}
