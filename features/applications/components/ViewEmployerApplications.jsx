"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ApplicationService } from "@/services/application.service";
import { useClaims } from "@/hooks/use-claims";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/services/_config";
import { useFetchData } from "@/hooks/use-fetch-data";

export function ViewEmployerApplications() {

    const router = useRouter();
    const { claims, loading: claimsLoading } = useClaims();
    const userId = claims?.id || claims?.userId;

    const [filtered, setFiltered] = useState([]);
    const [selectedJob, setSelectedJob] = useState("All Jobs");
    const [selectedLocation, setSelectedLocation] = useState("All Locations");
    const [selectedStatus, setSelectedStatus] = useState("All Status");

    const [jobOptions, setJobOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);

    // ===============================================
    // FETCH DATA
    // ===============================================

    const { data: applications, loading: applicationsLoading } = useFetchData(
        ApplicationService.getApplicationsByEmployer,
        [userId],
        [userId]
    )
    useEffect(() => {
        setFiltered(applications);

        const jobs = [...new Set(applications.map(item => item.title))];
        const locations = [...new Set(applications.map(item => item.location))];

        setJobOptions(["All Jobs", ...jobs]);
        setLocationOptions(["All Locations", ...locations]);
    }, [userId, applications]);

    // ===============================================
    // FILTERING LOGIC (SAME AS YOUR FLUTTER)
    // ===============================================
    useEffect(() => {
        let data = [...applications];

        if (selectedJob !== "All Jobs") {
            data = data.filter((item) => item.title === selectedJob);
        }

        if (selectedLocation !== "All Locations") {
            data = data.filter((item) => item.location === selectedLocation);
        }

        if (selectedStatus !== "All Status") {
            data = data.filter((item) => item.status === selectedStatus);
        }

        setFiltered(data);
    }, [selectedJob, selectedLocation, selectedStatus, applications]);

    if (claimsLoading || applicationsLoading) {
        return (
            <div className="w-full p-10 text-center text-gray-600">
                Loading applications...
            </div>
        );
    }

    // ===============================================
    // RENDER
    // ===============================================
    return (
        <div className="w-full max-w-6xl mx-auto p-4">

            {/* HEADER */}
            <div className="w-full flex items-center justify-between">
                <h1 className="text-2xl font-semibold mb-4">View Applications</h1>
                <div className="flex items-center gap-2 mb-4">
                    <Link href="/" className="text-blue-600 flex items-center gap-1">
                        <ChevronLeft size={18} /> Back
                    </Link>
                </div>
            </div>

            

            {/* FILTERS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">

                {/* JOB FILTER */}
                <Select onValueChange={setSelectedJob} defaultValue="All Jobs">
                    <SelectTrigger className="bg-white">
                        <SelectValue placeholder="All Jobs" />
                    </SelectTrigger>
                    <SelectContent>
                        {jobOptions.map((job, idx) => (
                            <SelectItem key={idx} value={job}>{job}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* LOCATION FILTER */}
                <Select onValueChange={setSelectedLocation} defaultValue="All Locations">
                    <SelectTrigger className="bg-white">
                        <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                        {locationOptions.map((loc, idx) => (
                            <SelectItem key={idx} value={loc}>{loc}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* STATUS FILTER */}
                <Select onValueChange={setSelectedStatus} defaultValue="All Status">
                    <SelectTrigger className="bg-white">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All Status">All Status</SelectItem>
                        <SelectItem value="Sent">Sent</SelectItem>
                        <SelectItem value="Reviewed">Reviewed</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Hired">Hired</SelectItem>
                    </SelectContent>
                </Select>

            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block w-full overflow-auto rounded-lg border bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700 text-[14px]">
                        <tr>
                            <th className="p-3 text-left">Applicant</th>
                            <th className="p-3 text-left">Job Title</th>
                            <th className="p-3 text-left">Location</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Applied On</th>
                            <th className="p-3 text-left">Resume</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((app, idx) => (
                            <tr key={idx} className="border-b">
                                <td className="p-3">{app.full_name}</td>
                                <td className="p-3">{app.title}</td>
                                <td className="p-3">{app.location}</td>
                                <td className="p-3">{app.status}</td>
                                <td className="p-3">{app.applied_on}</td>

                                {/* RESUME LINK */}
                                <td className="p-3">
                                    {app.document_path ? (
                                        <a
                                            href={app.document_path.startsWith("http")
                                                ? app.document_path
                                                : `${BASE_URL}/${app.document_path}`
                                            }
                                            target="_blank"
                                            className="text-blue-600 underline"
                                        >
                                            View Resume
                                        </a>
                                    ) : "No Resume"}
                                </td>

                                {/* VIEW PROFILE */}
                                <td
                                    className="p-3 text-blue-600 underline cursor-pointer"
                                    onClick={() =>
                                        router.push(`/employer/applications/view/${app.job_seeker_id}`)
                                    }
                                >
                                    View
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden flex flex-col gap-4 mt-4">
                {filtered.map((app, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow border">
                        <div className="font-semibold">{app.full_name}</div>
                        <div className="text-gray-600">{app.title}</div>
                        <div className="text-gray-600">{app.location}</div>

                        <div className="mt-2 text-sm">
                            <span className="px-2 py-1 bg-gray-200 rounded-md">{app.status}</span>
                        </div>

                        <div className="mt-2 text-gray-700">
                            Applied On: {app.applied_on}
                        </div>

                        <div className="mt-2">
                            {app.document_path ? (
                                <a
                                    href={app.document_path.startsWith("http")
                                        ? app.document_path
                                        : `${BASE_URL}/${app.document_path}`
                                    }
                                    target="_blank"
                                    className="text-blue-600 underline"
                                >
                                    View Resume
                                </a>
                            ) : "No Resume"}
                        </div>

                        <div
                            className="mt-2 text-blue-600 underline cursor-pointer"
                            onClick={() =>
                                router.push(`/employer/applications/view/${app.job_seeker_id}`)
                            }
                        >
                            View
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
