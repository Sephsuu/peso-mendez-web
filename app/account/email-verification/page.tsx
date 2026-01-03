import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function EmailVerifiedPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 to-blue-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8 text-center">            
                <img
                    src="/images/peso-mendez.png"
                    className="w-25 h-25 mx-auto"
                />
             

                {/* Title */}
                <h1 className="text-2xl font-semibold text-gray-800">
                    Email Verified Successfully
                </h1>

                {/* Message */}
                <div className="mt-4 text-sm text-gray-600 leading-relaxed text-left space-y-1">
                    <p className="pl-6">Your email address has been successfully verified.</p>
                    <p className="pl-6">Your account is now fully activated and secured.</p>
                    <p className="pl-6">You may now proceed to log in to your account.</p>
                    <p className="pl-6">For a better experience, we recommend using our mobile app.</p>
                </div>

                {/* Actions */}
                <div className="mt-7 flex flex-col gap-3">
                    <Link href="/auth/login">
                        <Button
                            className="text-sm inline-flex items-center justify-center w-full bg-primary px-4 py-2.5 font-semibold text-white hover:opacity-90 transition"
                        >
                            Continue to Login
                        </Button>
                    </Link> 

                    <Button
                        className="inline-flex items-center justify-center border border-primary px-4 py-2.5 text-sm font-semibold text-primary bg-white hover:bg-emerald-50 transition"
                    >
                        <LayoutGrid /> Download the App for Better Experience
                    </Button>
                </div>

                {/* Footer */}
                <p className="mt-6 text-xs text-gray-400 text-center">
                    © {new Date().getFullYear()} Your App. All rights reserved.
                </p>

            </div>
        </main>
    );
}
