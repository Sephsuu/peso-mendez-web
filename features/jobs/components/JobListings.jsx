"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Coins, PhilippinePeso } from "lucide-react";
import { useFetchData } from "@/hooks/use-fetch-data";
import { JobService } from "@/services/job.service";
import Link from "next/link";
import { useClaims } from "@/hooks/use-claims";
import { PESOLoader, SectionLoader } from "@/components/ui/loader";
import { caviteLocations } from "@/lib/utils";
import { formatToPeso } from "@/lib/helper";

export function JobListingPage() {
    const [activeTab, setActiveTab] = useState("featured");
    const [loading, setLoading] = useState(false);
    const [find, setFind] = useState("");
    const [type, setType] = useState("all");
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [filteredRecoJobs, setFilteredRecoJobs] = useState([]);

    const [location, setLocation] = useState("All Locations");
    const [minSalary, setMinSalary] = useState(0);
    const [maxSalary, setMaxSalary] = useState(0);

    const { claims, loading: authLoading } = useClaims();
    const userId = claims?.id || claims?.userId;

    const { data: jobs, loading: jobsLoading } = useFetchData(JobService.getAllJobs, [])
    const { data: recommendedJobs, loading: recommendedLoading } = useFetchData(
        JobService.getAllJobs, 
        [userId],
        [userId]
    )

    useEffect(() => {
        if (!jobs || jobs.length === 0) return;

        let result = jobs;

        // Search
        if (find.trim() !== "") {
            result = result.filter((job) =>
                job.title.toLowerCase().includes(find.toLowerCase())
            );
        }

        // Job type
        if (type !== "all") {
            result = result.filter(
                (job) => job.type.toLowerCase() === type.toLowerCase()
            );
        }

        // Location
        if (location !== "All Locations") {
            result = result.filter(
                (job) => job.citmun === location
            );
        }

        // Salary range
        if (!(minSalary === 0 && maxSalary === 0)) {
            result = result.filter((job) => {
                const salary = Number(job.salary) || 0;
                return salary >= minSalary && salary <= maxSalary;
            });
        }

        setFilteredJobs(result);
    }, [find, type, location, minSalary, maxSalary, jobs]);


    useEffect(() => {
        if (!recommendedJobs || recommendedJobs.length === 0) return;

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

        if (location !== "All Locations") {
            result = result.filter(
                (job) => job.citmun === location
            );
        }

        if (!(minSalary === 0 && maxSalary === 0)) {
            result = result.filter((job) => {
                const salary = Number(job.salary) || 0;
                return salary >= minSalary && salary <= maxSalary;
            });
        }

        setFilteredRecoJobs(result);
    }, [find, type, location, minSalary, maxSalary, recommendedJobs]);



    if (jobsLoading || authLoading) return <PESOLoader />
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
                                className="flex-1 min-w-[250px] h-11"
                            />

                            <Select value={location} onValueChange={setLocation}>
                                <SelectTrigger className="flex-1 min-w-[200px] !h-11">
                                    <SelectValue placeholder="Select Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Locations">All Locations</SelectItem>
                                    {caviteLocations.map((loc) => (
                                        <SelectItem key={loc} value={loc}>
                                            {loc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 justify-center">
                            <Input
                                type="number"
                                placeholder="Min Salary"
                                onChange={(e) => setMinSalary(Number(e.target.value) || 0)}
                                className="w-[150px] h-11"
                            />
                            <Input
                                type="number"
                                placeholder="Max Salary"
                                onChange={(e) => setMaxSalary(Number(e.target.value) || 0)}
                                className="w-[150px] h-11"
                            />
                        </div>


                        <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="w-[180px] border-gray-300 focus:ring-indigo-500 !h-11">
                                    <SelectValue placeholder="All Jobs" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Jobs</SelectItem>
                                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                                </SelectContent>
                            </Select>
                            <Link href="/account">
                                <Button className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow">
                                    View Profile
                                </Button>
                            </Link>
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
                            <SectionLoader />
                        ) : filteredJobs.length === 0 ? (
                            <p className="text-center text-gray-500 py-6">
                                No jobs found. Try adjusting your filters.
                            </p>
                        ) : activeTab === "featured" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                                {filteredJobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className="bg-white rounded-xl p-5 space-y-3 border border-gray-200 transition shadow-xs shadow-primary hover:shadow-md"
                                    >
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {job.title}
                                        </h4>
                                        <p className="text-gray-700">{job.company}</p>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <MapPin className="w-4 h-4 text-pink-500" />
                                            <span>{job.citmun}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                                            <PhilippinePeso className="w-4 h-4 text-yellow-600" />
                                            <span className="font-semibold text-blue-700">
                                                {formatToPeso(job.salary)} • {job.company}
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
