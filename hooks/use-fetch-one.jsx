import { useEffect, useState } from "react";

export function useFetchOne(fetchFn, deps = [], args = []) {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        // ⛔ Prevent running fetch when args contain null/undefined
        if (args.some(a => a == null || a === undefined)) {
            setLoading(false);
            return;
        }

        async function fetchData() {
            try {
                setLoading(true);
                const result = await fetchFn(...args);
                if (isMounted) setItem(result);
            } catch (err) {
                const message = err?.message || "Failed to fetch data";
                setError(message);

                // ⛔ Only show toast if it's a REAL error — not initial empty args.
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
