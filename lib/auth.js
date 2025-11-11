// utils/auth.js

function base64UrlDecode(str) {
    try {
        const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to decode token payload:", error);
        return null;
    }
}

export function getDecodedToken() {
    // ✅ Prevent running on the server
    if (typeof window === "undefined") {
        console.warn("getDecodedToken() called on server — returning null");
        return null;
    }

    try {
        const token = localStorage.getItem("jwt_token");
        if (!token) return null;

        const parts = token.split(".");
        if (parts.length !== 3) return null;

        const payload = base64UrlDecode(parts[1]);
        if (!payload) return null;

        // ✅ Optional: Expiration check
        const now = Date.now() / 1000;
        if (payload.exp && payload.exp < now) {
            console.warn("JWT expired");
            localStorage.removeItem("jwt_token");
            return null;
        }

        return payload;
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
}
