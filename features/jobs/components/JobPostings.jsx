"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { JobService } from "@/services/job.service";
import { useClaims } from "@/hooks/use-claims";
import { toast } from "sonner";
import { useFetchData } from "@/hooks/use-fetch-data";

export function JobPostings() {
    const { claims, loading } = useClaims();
    const userId = claims?.id || claims?.userId;

    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedTab, setSelectedTab] = useState("active");
    const [search, setSearch] = useState("");
    const [reload, setReload] = useState(false);

    const { data: jobs, loading: jobsLoading } = useFetchData(
        JobService.getJobsByEmployer,
        [userId],
        [userId]
    ) 

    // ========== FILTER BY SEARCH ========== //
    useEffect(() => {
        let data = jobs;

        if (selectedTab === "active") {
            data = data.filter((job) => job.status === "active");
        } else {
            data = data.filter((job) => job.status === "inactive");
        }

        if (search.trim() !== "") {
            data = data.filter((job) =>
                job.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredJobs(data);
    }, [jobs, search, selectedTab]);

    // ========== DELETE JOB ========== //
    async function handleDelete(id) {
        try {
            const res = await JobService.deleteJob(id);
            toast.success("Job deleted!");
            setReload(!reload);
        } catch (err) {
            toast.error("Delete failed");
        }
    }

    if (loading || jobsLoading)
        return <div className="p-4 text-center">Loading…</div>;

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">My Jobs Postings</h1>
                <Link href="/" className="text-blue-600 underline">
                    ← Back
                </Link>
            </div>

            {/* TABS */}
            <Tabs defaultValue="active" onValueChange={setSelectedTab}>
                <TabsList className="flex justify-center mb-6 bg-indigo-50 rounded-lg">
                    <TabsTrigger value="active" className="px-6 data-[state=active]:text-blue-600 font-medium">
                        Active Jobs
                    </TabsTrigger>
                    <TabsTrigger value="inactive" className="px-6 data-[state=active]:text-blue-600 font-medium">
                        Inactive Jobs
                    </TabsTrigger>
                </TabsList>

                {/* SEARCH BAR */}
                <div className="mb-4 w-full">
                    <Input
                        placeholder="Search a job by its title."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-white"
                    />
                </div>

                {/* TABLE CONTENT */}
                <TabsContent value={selectedTab}>
                    <div className="overflow-auto rounded-lg border bg-white">
                        <table className="w-full">
                            <thead className="bg-gray-200 text-sm font-semibold">
                                <tr>
                                    <th className="p-3 text-left min-w-[120px]">Title</th>
                                    <th className="p-3 text-left min-w-[120px]">Company</th>
                                    <th className="p-3 text-left min-w-[140px]">Location</th>
                                    <th className="p-3 text-left min-w-[100px]">Type</th>
                                    <th className="p-3 text-left min-w-[120px]">Salary</th>
                                    <th className="p-3 text-left min-w-[100px]">Visibility</th>
                                    <th className="p-3 text-left min-w-[150px]">Date Posted</th>
                                    <th className="p-3 text-left min-w-[150px]">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredJobs.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="p-4 text-center text-gray-600 font-medium"
                                        >
                                            No jobs found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredJobs.map((job) => (
                                        <tr key={job.id} className="border-b">
                                            <td className="p-3">{job.title}</td>
                                            <td className="p-3">{job.company}</td>
                                            <td className="p-3">{job.location}</td>
                                            <td className="p-3">{job.type}</td>
                                            <td className="p-3">{job.salary}</td>
                                            <td className="p-3">
                                                <Badge
                                                    className={
                                                        job.visibility === "Premium"
                                                            ? "bg-yellow-700 text-white"
                                                            : job.visibility === "Branded"
                                                            ? "bg-gray-500 text-white"
                                                            : "bg-yellow-900 text-white"
                                                    }
                                                >
                                                    {job.visibility}
                                                </Badge>
                                            </td>
                                            <td className="p-3">{job.posted_on}</td>
                                            <td className="p-3 flex gap-2">
                                                <Link href={`/jobs/${job.id}`}>
                                                    <Button
                                                        size="sm"
                                                        className="bg-blue-600 text-white"
                                                    >
                                                        View
                                                    </Button>
                                                </Link>

                                                <Link href={`/employer/jobs/update/${job.id}`}>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-700 text-white"
                                                    >
                                                        Update
                                                    </Button>
                                                </Link>

                                                <Button
                                                    size="sm"
                                                    className="bg-red-600 text-white"
                                                    onClick={() => handleDelete(job.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
