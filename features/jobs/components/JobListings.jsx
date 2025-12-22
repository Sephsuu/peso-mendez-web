"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Coins } from "lucide-react";
import { useFetchData } from "@/hooks/use-fetch-data";
import { JobService } from "@/services/job.service";
import Link from "next/link";
import { useClaims } from "@/hooks/use-claims";

export function JobListingPage() {
    const [activeTab, setActiveTab] = useState("featured");
    const [loading, setLoading] = useState(false);
    const [find, setFind] = useState("");
    const [type, setType] = useState("all");
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [filteredRecoJobs, setFilteredRecoJobs] = useState([]);

    const { claims, loading: authLoading } = useClaims();
    const userId = claims?.id || claims?.userId;

    const { data: jobs, loading: jobsLoading } = useFetchData(JobService.getAllJobs, [])
    const { data: recommendedJobs, loading: recommendedLoading } = useFetchData(
        JobService.getAllJobs, 
        [userId],
        [userId]
    )

    useEffect(() => {
        if (!jobs || jobs.length === 0) return;   // prevent unnecessary runs

        let result = jobs;

        if (find.trim() !== "") {
            result = result.filter((job) =>
                job.title.toLowerCase().includes(find.toLowerCase())
            );
        }

        if (type !== "all") {
            result = result.filter(
                (job) => job.type.toLowerCase() === type.toLowerCase()
            );
        }

        setFilteredJobs(result);
    }, [find, type, jobs]);

    useEffect(() => {
        if (!recommendedJobs || recommendedJobs.length === 0) return;   // prevent unnecessary runs

        let result = recommendedJobs;

        if (find.trim() !== "") {
            result = result.filter((job) =>
                job.title.toLowerCase().includes(find.toLowerCase())
            );
        }

        if (type !== "all") {
            result = result.filter(
                (job) => job.type.toLowerCase() === type.toLowerCase()
            );
        }

        setFilteredRecoJobs(result);
    }, [find, type, recommendedJobs]);


    if (jobsLoading || authLoading) return <div>Loading</div>
    return (
        <div className="min-h-screen bg-linear-to-b from-indigo-50 via-indigo-100 to-indigo-50 flex flex-col">
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* ================== */}
                {/* 🔹 TABS SECTION */}
                {/* ================== */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="flex justify-center mb-6 bg-indigo-50 rounded-lg">
                        <TabsTrigger value="featured" className="px-6 data-[state=active]:text-blue-600 font-medium">
                            Featured Jobs
                        </TabsTrigger>
                        <TabsTrigger value="recommended" className="px-6 data-[state=active]:text-blue-600 font-medium">
                            Recommended Jobs
                        </TabsTrigger>
                    </TabsList>

                    {/* ================== */}
                    {/* 🔍 SEARCH BAR */}
                    {/* ================== */}
                    <section className="bg-slate-50 rounded-xl shadow-sm p-6 space-y-4">
                        <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800">
                            Find Jobs Near Mendez, Cavite
                        </h2>

                        <div className="flex flex-col md:flex-row gap-3 justify-center">
                            <Input
                                placeholder="Job title, keywords, or company"
                                value={find}
                                onChange={(e) => setFind(e.target.value)}
                                className="flex-1 min-w-[250px] h-11 border-gray-300 focus-visible:ring-indigo-500"
                            />
                            <Input
                                placeholder="Mendez, Cavite"
                                disabled
                                className="flex-1 min-w-[200px] h-11 border-gray-300 bg-gray-100 text-gray-700"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="w-[180px] h-11 border-gray-300 focus:ring-indigo-500">
                                    <SelectValue placeholder="All Jobs" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Jobs</SelectItem>
                                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow">
                                View Profile
                            </Button>
                        </div>
                    </section>

                    {/* ================== */}
                    {/* 💼 FEATURED JOBS */}
                    {/* ================== */}
                    <TabsContent value="featured" className="space-y-6 mt-6">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 text-center">
                            {activeTab === "featured"
                                ? "Featured Local Jobs"
                                : "Jobs Matching My Skills"}
                        </h3>

                        {loading ? (
                            <p className="text-center text-gray-500 py-6">Loading jobs...</p>
                        ) : filteredJobs.length === 0 ? (
                            <p className="text-center text-gray-500 py-6">
                                No jobs found. Try adjusting your filters.
                            </p>
                        ) : activeTab === "featured" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                                {filteredJobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className="bg-white rounded-xl shadow p-5 space-y-3 border border-gray-200 hover:shadow-md transition"
                                    >
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {job.title}
                                        </h4>
                                        <p className="text-gray-700">{job.company}</p>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <MapPin className="w-4 h-4 text-pink-500" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                                            <Coins className="w-4 h-4 text-yellow-600" />
                                            <span className="font-semibold text-blue-700">
                                                {job.salary} • {job.company}
                                            </span>
                                        </div>
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-3 w-fit">
                                            <Link href={`/jobs/${job.id}`}>View Details</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                                {filteredRecoJobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className="bg-white rounded-xl shadow p-5 space-y-3 border border-gray-200 hover:shadow-md transition"
                                    >
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {job.title}
                                        </h4>
                                        <p className="text-gray-700">{job.company}</p>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <MapPin className="w-4 h-4 text-pink-500" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                                            <Coins className="w-4 h-4 text-yellow-600" />
                                            <span className="font-semibold text-blue-700">
                                                {job.salary} • {job.company}
                                            </span>
                                        </div>
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-3 w-fit">
                                            <Link href={`/jobs/${job.id}`}>View Details</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* ================== */}
                    {/* ⭐ RECOMMENDED JOBS */}
                    {/* ================== */}
                    <TabsContent value="recommended" className="mt-6">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 text-center mb-4">
                            Recommended for You
                        </h3>
                        <div className="text-gray-500 text-center py-6 italic">
                            Recommended jobs will appear here based on your profile.
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
