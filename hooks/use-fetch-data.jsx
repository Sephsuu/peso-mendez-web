"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * A reusable hook to fetch data asynchronously.
 * @param {Function} fetchFn - The async function that returns the data.
 * @param {Array} deps - Additional dependencies for re-fetching.
 * @param {Array} args - Arguments to pass to fetchFn.
 * @param {number} page - Pagination page number.
 * @param {number} size - Pagination size.
 */
export function useFetchData(fetchFn, deps = [], args = [], page = 0, size = 1000) {
    const [items, setItems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                setLoading(true);
                const result = await fetchFn(...args, page, size);

                if (!isMounted) return;

                if (result && typeof result === "object" && "content" in result) {
                    setItems(result.content);
                } else {
                    setItems(result);
                }
            } catch (err) {
                const message = err?.message || err?.error || "Failed to fetch data";
                setError(message);
                toast.error(message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        if (!fetchFn) return;
        if (!args || args.some(a => a === undefined || a === null || a === 0)) {
            setLoading(false);
            return;
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [page, size, ...args, ...deps]);

    const data = Array.isArray(items) ? items : [];
    return { data, loading, error };
}
