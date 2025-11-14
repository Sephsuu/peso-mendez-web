"use client";

import { useEffect, useState } from "react";
import { getDecodedToken } from "@/lib/auth";

export function useClaims() {
    const [claims, setClaims] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function fetchClaims() {
            try {
                const decoded = await getDecodedToken();
                if (mounted && decoded) {
                    setClaims(decoded);
                }
            } catch (err) {
                console.error("Failed to decode token:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchClaims();

        return () => {
            mounted = false;
        };
    }, []);

    return { claims, loading };
}
