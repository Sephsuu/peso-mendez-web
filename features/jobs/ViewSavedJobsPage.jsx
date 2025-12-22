"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchData } from "@/hooks/use-fetch-data";
import { ApplicationService } from "@/services/application.service";
import { useClaims } from "@/hooks/use-claims";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Mail, MessageSquare, ArrowLeft } from "lucide-react";
import { AppFooter } from "@/components/shared/AppFooter";
import Link from "next/link";
import { JobService } from "@/services/job.service";

export function AllSavedJobsPage() {
    const router = useRouter();
    const { claims, loading } = useClaims();
    const userId = claims?.id || claims?.userId;

    const { data: applications, loading: appsLoading } = useFetchData(
        JobService.getSavedJobsByUser,
        [userId],
        [userId]
    );

    const [viewing, setViewing] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    if (loading || appsLoading) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-linear-to-b from-indigo-50 to-indigo-100 flex flex-col">
            {/* HEADER */}
            <section className="bg-white shadow-sm px-4 sm:px-8 py-4 flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-semibold text-indigo-700">All Saved Jobs</h1>
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
            </section>

            {/* MAIN CONTENT */}
            <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6">
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
                    <table className="w-full text-sm text-gray-700">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="p-3">Title</th>
                                <th className="p-3">Company</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Salary</th>
                                <th className="p-3">Employer</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications?.length > 0 ? (
                                applications.map((job) => (
                                    <tr key={job.id} className="border-t hover:bg-gray-50 transition">
                                        <td className="p-3">{job.title || "N/A"}</td>
                                        <td className="p-3">{job.company || "N/A"}</td>
                                        <td className="p-3">{job.location || "N/A"}</td>
                                        <td className="p-3">{job.salary || "N/A"}</td>
                                        <td className="p-3">{job.full_name || "N/A"}</td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <Link href={`/jobs/saved/${job.job_id}`}>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        View
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => toast.info(`Message ${job.full_name}`)}
                                                >
                                                    <MessageSquare className="w-4 h-4" /> Message
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-gray-500">
                                        No applications found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* FOOTER */}
            <AppFooter />
        </div>
    );
}

// ================ Helpers ================
function Detail({ label, value }) {
    return (
        <div className="flex justify-between">
            <span className="font-medium text-indigo-700">{label}:</span>
            <span>{value || "—"}</span>
        </div>
    );
}
