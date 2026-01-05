"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth.service";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
    const email = useMemo(() => searchParams.get("email") ?? "", [searchParams]);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const isInvalidLink = !token || !email;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isInvalidLink) {
            toast.error("Invalid reset link. Please request a new one.");
            return;
        }

        if (!newPassword || !confirmPassword) {
            toast.error("Please enter and confirm your new password.");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        toast.info("Resetting password. Please wait...");

        try {
            await AuthService.resetPassword({ email, token, newPassword });

            toast.success("Password reset successful! You can now sign in.");
            router.push("/auth/login");
        } catch (error: any) {
            toast.error(error?.message || "Reset failed. Please request a new reset link.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8 border border-gray-100 -mt-24">
                <h1 className="text-2xl sm:text-3xl font-semibold text-center text-primary mb-6">
                    Reset Password
                </h1>

                {isInvalidLink ? (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 text-center">
                            Invalid or missing reset token. Please request a new password reset link.
                        </p>

                        <Button
                            className="w-full bg-primary hover:bg-primary/80 text-white h-11 text-md"
                            onClick={() => router.push("/auth/login")}
                        >
                            Back to Login
                        </Button>

                        <p className="text-center text-gray-600 text-sm">
                            Need a new link?{" "}
                            <Link href="/auth/forgot-password" className="text-primary font-medium hover:underline">
                                Forgot Password
                            </Link>
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 text-center mb-4">
                            Resetting password for <span className="font-medium">{decodeURIComponent(email)}</span>
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="newPassword" className="text-gray-600">
                                    New Password
                                </Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-blue-50 border-primary/30 focus-visible:ring-primary w-full"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="confirmPassword" className="text-gray-600">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-blue-50 border-primary/30 focus-visible:ring-primary w-full"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/80 text-white h-11 text-md"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </form>

                        <p className="text-center text-gray-600 mt-6 text-sm sm:text-base">
                            Remembered your password?{" "}
                            <Link href="/auth/login" className="text-primary font-medium hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
