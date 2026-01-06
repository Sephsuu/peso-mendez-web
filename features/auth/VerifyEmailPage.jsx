"use client";

import { useSearchParams } from "next/navigation";

export function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const handleVerify = () => {
        if (!token) {
            alert("Invalid or missing verification token.");
            return;
        }

        window.location.href =
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-email?token=${token}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md max-w-md w-full text-center">
                <h1 className="text-xl font-semibold mb-4">
                    Verify Your Email
                </h1>

                <button
                    onClick={handleVerify}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Verify Email
                </button>
            </div>
        </div>
    );
}
