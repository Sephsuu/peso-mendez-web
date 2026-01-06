"use client";

import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const handleVerify = () => {
        if (!token) {
            alert("Invalid or missing verification token.");
            return;
        }

        // 🔥 Redirect browser to backend endpoint
        window.location.href =
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-email?token=${token}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md max-w-md w-full text-center">
                <h1 className="text-xl font-semibold mb-4">
                    Verify Your Email
                </h1>

                <p className="text-gray-600 mb-6">
                    Click the button below to verify your email address.
                </p>

                <button
                    onClick={handleVerify}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Verify Email
                </button>
            </div>
        </div>
    );
}
