"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // for snackbar-like notifications
import { AuthService } from '@/services/auth.service'

export function LoginPage() {
    const router = useRouter();

    // Form states
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailOrUsername || !password) {
            toast.error("Please enter your email/username and password.");
            return;
        }

        setLoading(true);
        toast.info("Verifying credentials. Please wait...");

        try {
            const response = await AuthService.login({emailOrUsername, password});

            const { token, user, status } = response;

            if (status === "inactive") {
                toast.warning("Your account is deactivated. Please contact the PESO Mendez administrator.");
                setLoading(false);
                return;
            }

            if (token) {
                localStorage.setItem("jwt_token", token);
                toast.success("Successfully logged in!");

                const role = user?.role;
                window.location.href = "/";
            } else {
                toast.error("Token missing in response.");
            }
        } catch (error) {
            toast.error(error.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8 border border-gray-100 -mt-24">
                
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-center text-primary mb-6">
                    Sign In to Mendez PESO
                </h1>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="email" className="text-gray-600">
                            Email address or Username
                        </Label>
                        <Input
                            id="email"
                            type="text"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            placeholder="you@example.com"
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary w-full"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <Label htmlFor="password" className="text-gray-600">
                                Password
                            </Label>
                            <Link className="text-sm text-primary hover:underline" href="#">
                                Forgot?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary w-full"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/80 text-white h-11 text-md"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </Button>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-600 mt-6 text-sm sm:text-base">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="text-primary font-medium hover:underline">
                        Register Now
                    </Link>
                </p>

            </div>
        </div>
    );
}
