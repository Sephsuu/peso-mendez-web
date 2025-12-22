"use client";

import { Briefcase, FileText, MessageSquare, Bell, ShieldCheck, Users, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { VerificationService } from "@/services/verification.service";
import { useClaims } from "@/hooks/use-claims";
import Link from "next/link";

export function EmployerDashboard() {
    const { claims, loading } = useClaims();
    const userId = claims?.id || claims?.userId;

    const { data: verification, loading: verificationLoading } = useFetchOne(
        VerificationService.getVerificationByUser,
        [userId],
        [userId]
    )

    console.log(verification);

    if (loading || verificationLoading) return <div>Loading</div>
    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-6">

            {/* HEADER */}
            <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Briefcase className="w-6 h-6" />
                    Employer Dashboard
                </h1>
                {!verification || Object.keys(verification).length === 0 ? (
                    <div className="p-2 m-2 shadow-sm max-w-100 mx-auto rounded-md bg-yellow-100">
                        <div className="text-warning font-semibold">Account Pending Verification</div>
                        <Link 
                            href=""
                            className="font-semibold underline"
                        >
                            Submit Documents
                        </Link>
                    </div>
                ) : (
                    <p className="text-sm text-green-600 font-medium">
                        Verification Status: <span className="uppercase">{ verification.status }</span>
                    </p>
                )}
            </div>

            {/* STATS */}
            <div className="flex flex-col gap-4">

                {/* Active Jobs */}
                <Link href="/jobs">
                    <div className="bg-green-600 text-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-medium flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Active Jobs
                            </span>
                            <span className="text-3xl font-bold">4</span>
                        </div>
                    </div>
                </Link>

                {/* Applications */}
                <Link href="/applications">
                    <div className="bg-blue-600 text-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-medium flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Applications
                            </span>
                            <span className="text-3xl font-bold">6</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* SECTION: Post Jobs */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-500" />
                    Post Jobs
                </h2>
                <p className="text-sm mt-2 mb-3">
                    Create new job posts with Lite, Branded, or Premium visibility.
                </p>
                <Link href="/jobs/post">
                    <Button>Post New Job</Button>
                </Link>
            </div>

            {/* SECTION: Manage Applications */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    Manage Applications
                </h2>
                <p className="text-sm mt-2 mb-3">
                    View, filter, and track candidate applications.
                </p>
                <Button 
                    variant="outline"
                    className="border-primary bodrer-2 text-primary"
                >
                    View Applications
                </Button>
            </div>

            {/* SECTION: Communication */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-gray-500" />
                    Communication
                </h2>
                <p className="text-sm mt-2 mb-3">
                    Message applicants directly and receive email notifications.
                </p>
                <Button 
                    variant="outline"
                    className="border-primary bodrer-2 text-primary"
                >
                    Open Messages
                </Button>
            </div>

            {/* SECTION: PESO Assistance */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Handshake className="w-5 h-5 text-yellow-600" />
                    PESO Assistance
                </h2>
                <p className="text-sm mt-2 mb-3">
                    Request help for job fairs or shortlisting.
                </p>
                <Button 
                    variant="outline"
                    className="border-primary bodrer-2 text-primary"
                >
                    Request Help
                </Button>
            </div>

            {/* SECTION: Recent Notifications */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5 text-yellow-500" />
                    Recent Notifications
                </h2>
                <p className="text-sm mt-2 mb-3">No notifications yet.</p>
                <Button 
                    variant="outline"
                    className="border-primary bodrer-2 text-primary"
                >
                    View Notifications
                </Button>
            </div>

            {/* SECTION: Compliance */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                    Compliance
                </h2>
                <p className="text-sm mt-2 mb-3">
                    View templates and stay updated with labor laws.
                </p>
                <Button 
                    variant="outline"
                    className="border-primary bodrer-2 text-primary"
                >
                    Compliance Section
                </Button>
            </div>
        </div>
    );
}
