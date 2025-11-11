"use client";

import { Button } from "@/components/ui/button";
import { AppFooter } from "@/components/shared/AppFooter";

export function JobSeekerDashboard() {
    const applications = []; // static data
    const savedJobs = []; // static data
    const user = { full_name: "Marcela Del Pillar", profileStrength: 0 };

    return (
        <div className="min-h-screen flex flex-col bg-purple-50">
            {/* Header */}
            <header className="text-center py-8 px-4">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                    Welcome Back!
                </h1>
                <p className="text-lg md:text-xl font-bold text-gray-800">
                    {user.full_name}
                </p>
            </header>

            <main className="flex-1 px-4 md:px-10 space-y-8 max-w-6xl mx-auto w-full">

                {/* Profile Strength */}
                <section className="bg-white rounded-xl shadow p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Profile Strength</h2>
                        <span className="text-sm font-medium">{user.profileStrength}%</span>
                    </div>

                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-3 bg-blue-500 rounded-full"
                            style={{ width: `${user.profileStrength}%` }}
                        ></div>
                    </div>

                    <p className="text-gray-600 text-center text-sm md:text-base">
                        To complete your profile, please list your skills and upload your resume.
                    </p>

                    <div className="flex justify-center">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6">
                            Edit Profile
                        </Button>
                    </div>
                </section>

                {/* Notifications + Messages (Responsive Grid) */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Notifications */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Notifications</h2>
                            <button className="text-blue-600 text-sm font-medium hover:underline">
                                See All
                            </button>
                        </div>
                        <p className="text-gray-500 text-center mt-3">
                            No new notifications.
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Messages</h2>
                            <button className="text-blue-600 text-sm font-medium hover:underline">
                                See All
                            </button>
                        </div>
                        <p className="text-gray-600 text-center mt-3">
                            Chat with employers regarding your applications.
                        </p>
                        <div className="flex justify-center mt-3">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6">
                                Go To Messages
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Applications + Saved Jobs (Responsive Grid) */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Your Applications */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold">Your Applications</h2>
                            <button className="text-blue-600 text-sm font-medium hover:underline">
                                See All
                            </button>
                        </div>

                        {applications.length === 0 ? (
                            <div className="bg-green-100 rounded-xl p-6 text-center">
                                <p className="text-gray-700">
                                    You haven't applied to any jobs yet.<br />
                                    Start applying to jobs from the job listings page!
                                </p>
                                <Button className="bg-blue-600 mt-3 hover:bg-blue-700 text-white font-semibold px-6">
                                    Browse Jobs
                                </Button>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 font-semibold">Job Title</th>
                                        <th className="p-3 font-semibold">Status</th>
                                        <th className="p-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((app, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="p-3">{app.title}</td>
                                            <td className="p-3">{app.status}</td>
                                            <td className="p-3 flex gap-2">
                                                <Button size="sm" className="bg-blue-600 text-white">
                                                    View
                                                </Button>
                                                <Button size="sm" className="bg-green-600 text-white">
                                                    Message
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Saved Jobs */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold">Saved Jobs</h2>
                            <button className="text-blue-600 text-sm font-medium hover:underline">
                                See All
                            </button>
                        </div>

                        {savedJobs.length === 0 ? (
                            <div className="bg-green-100 rounded-xl p-6 text-center">
                                <p className="text-gray-700">
                                    You haven't saved any jobs yet.<br />
                                    Save jobs to review them later!
                                </p>
                                <Button className="bg-blue-600 mt-3 hover:bg-blue-700 text-white font-semibold px-6">
                                    Browse Jobs
                                </Button>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 font-semibold">Job Title</th>
                                        <th className="p-3 font-semibold">Salary</th>
                                        <th className="p-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {savedJobs.map((job, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="p-3">{job.title}</td>
                                            <td className="p-3">{job.salary}</td>
                                            <td className="p-3 flex gap-2">
                                                <Button size="sm" className="bg-blue-600 text-white">
                                                    View
                                                </Button>
                                                <Button size="sm" className="bg-green-600 text-white">
                                                    Message
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </main>

            <AppFooter />
        </div>
    );
}
