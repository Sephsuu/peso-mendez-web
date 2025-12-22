"use client";

import { useFetchData } from "@/hooks/use-fetch-data";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { ApplicationService } from "@/services/application.service";
import { JobService } from "@/services/job.service";
import { UserService } from "@/services/user.service";
import { AppFooter } from "@/components/shared/AppFooter";
import { Button } from "@/components/ui/button";
import { useClaims } from "@/hooks/use-claims";
import { format } from "date-fns";
import Link from "next/link";

export function JobSeekerDashboard() {
    const { claims, loading } = useClaims();
    const userId = claims?.id || claims?.userId;

    const { data: applications, loading: loadingApps } = useFetchData(
        ApplicationService.getApplicationsByUser,
        [userId],
        [userId],
        0,
        100
    );

    const { data: savedJobs, loading: loadingSaved } = useFetchData(
        JobService.getSavedJobsByUser,
        [userId],
        [userId],
        0,
        100
    );

    const { data: profileStrength, loading: loadingProfile } = useFetchOne(
        UserService.getUserProfileStrength,
        [userId],
        [userId]
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen flex flex-col bg-purple-50">
            {/* Header */}
            <header className="text-center py-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                    Welcome Back!
                </h1>
                <p className="text-lg md:text-xl font-bold text-gray-800">{claims.full_name}</p>
            </header>

            <main className="flex-1 px-4 md:px-10 space-y-8 max-w-7xl mx-auto w-full">
                {/* Profile Strength */}
                <section className="bg-white rounded-xl shadow p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Profile Strength</h2>
                        <span className="text-sm font-medium">
                            {loadingProfile ? "..." : `${profileStrength ?? 0}%`}
                        </span>
                    </div>

                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-3 bg-blue-500 rounded-full transition-all"
                            style={{ width: `${profileStrength ?? 0}%` }}
                        ></div>
                    </div>

                    <p className="text-gray-600 text-center text-sm md:text-base">
                        To complete your profile, please list your skills and upload your resume.
                    </p>

                    <div className="flex justify-center">
                        <Link href="/account">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6">
                                Edit Profile
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* ====================== */}
                {/* 🧾 APPLICATIONS TABLE */}
                {/* ====================== */}
                <section className="bg-white rounded-xl shadow p-6 overflow-x-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Your Applications</h2>
                        <Link href='/applications'>
                            <button className="text-blue-600 text-sm font-medium hover:underline">
                                See All
                            </button>
                        </Link>
                    </div>

                    {loadingApps ? (
                        <p className="text-gray-500 text-center">Loading...</p>
                    ) : !applications?.length ? (
                        <div className="bg-green-100 rounded-xl p-6 text-center">
                            <p className="text-gray-700">
                                You haven’t applied to any jobs yet.<br />
                                Start applying to jobs from the job listings page!
                            </p>
                            <Button className="bg-blue-600 mt-3 hover:bg-blue-700 text-white font-semibold px-6">
                                Browse Jobs
                            </Button>
                        </div>
                    ) : (
                        <table className="min-w-full border border-gray-300 text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 border text-left font-semibold text-gray-700">Job Title</th>
                                    <th className="p-3 border text-left font-semibold text-gray-700">Company</th>
                                    <th className="p-3 border text-left font-semibold text-gray-700">Location</th>
                                    <th className="p-3 border text-left font-semibold text-gray-700">Applied On</th>
                                    <th className="p-3 border text-left font-semibold text-gray-700">Status</th>
                                    <th className="p-3 border text-left font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.slice(0, 5).map((app, i) => (
                                    <tr key={i} className="border-t hover:bg-gray-50">
                                        <td className="p-3 border text-blue-600 font-medium cursor-pointer hover:underline">
                                            {app.title ?? "N/A"}
                                        </td>
                                        <td className="p-3 border">{app.company ?? "N/A"}</td>
                                        <td className="p-3 border">{app.location ?? "N/A"}</td>
                                        <td className="p-3 border">
                                            {app.applied_on
                                                ? format(new Date(app.applied_on), "MMM dd, yyyy")
                                                : "N/A"}
                                        </td>
                                        <td className="p-3 border">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    app.applicationStatus === "Rejected"
                                                        ? "bg-red-100 text-red-600"
                                                        : app.applicationStatus === "Sent"
                                                        ? "bg-blue-100 text-blue-600"
                                                        : app.applicationStatus === "Reviewed"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {app.applicationStatus ?? "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-3 border">
                                            <div className="flex gap-2">
                                                <Link href={`/applications/${app.job_id}`}>
                                                    <Button
                                                        size="sm"
                                                        className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"
                                                    >
                                                        View
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-1"
                                                >
                                                    Message
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>

                {/* ====================== */}
                {/* 💼 SAVED JOBS AS CARDS */}
                {/* ====================== */}
                <section className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Saved Jobs</h2>
                        <Link href='/jobs/saved'>
                            <button className="text-blue-600 text-sm font-medium hover:underline">
                                See All
                            </button>
                        </Link>
                    </div>

                    {loadingSaved ? (
                        <p className="text-gray-500 text-center">Loading...</p>
                    ) : !savedJobs?.length ? (
                        <div className="bg-green-100 rounded-xl p-6 text-center">
                            <p className="text-gray-700">
                                You haven’t saved any jobs yet.<br />
                                Save jobs to review them later!
                            </p>
                            <Button className="bg-blue-600 mt-3 hover:bg-blue-700 text-white font-semibold px-6">
                                Browse Jobs
                            </Button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {savedJobs.slice(0, 6).map((job, i) => (
                                <div
                                    key={i}
                                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col justify-between"
                                >
                                    <div>
                                        <h3 className="text-base font-semibold text-blue-600 hover:underline cursor-pointer">
                                            {job.title ?? "Untitled Job"}
                                        </h3>
                                        <p className="text-sm text-gray-700 mt-1 font-medium">
                                            {job.company ?? "Company not specified"}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {job.location ?? "Location not available"}
                                        </p>
                                        <p className="text-sm text-gray-700 mt-2 font-semibold">
                                            ₱{job.salary ?? "N/A"}
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <Link href={`/jobs/saved/${job.id}`}>
                                            <Button
                                                size="sm"
                                                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                            >
                                                View Job
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <AppFooter />
        </div>
    );
}
