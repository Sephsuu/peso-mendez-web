"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, Search } from "lucide-react";
import { formatDateToWord } from "@/lib/helper";
import { UserService } from "@/services/user.service";
import JobSeekersTable from "./components/JobSeekersTable";

export function JobSeekersReportPage() {
    const [loading, setLoading] = useState(true);
    const [find, setFind] = useState("");
    const [jobSeekers, setJobSeekers] = useState([]);
    const [filteredJobSeekers, setFilteredJobSeekers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await UserService.getUserByRole("job_seeker");
                setJobSeekers(res);
            } catch (e) {
                alert("Error: " + e);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (!find) {
            setFilteredJobSeekers(jobSeekers);
        } else {
            const keyword = find.toLowerCase();
            setFilteredJobSeekers(
                jobSeekers.filter((u) =>
                    (u.full_name || "").toLowerCase().includes(keyword) ||
                    (u.email || "").toLowerCase().includes(keyword)
                )
            );
        }
    }, [find, jobSeekers]);

    function exportPdf() {
        const rows = PdfExporter.mapToRowList({
            data: jobSeekers,
            keys: [
                "full_name",
                "email",
                "username",
                "contact",
                "sex",
                "clientele",
                "highest_education",
                "citmun",
            ],
        });

        PdfExporter.exportTable({
            title: "Active Job Seekers Report",
            headers: [
                "Full Name",
                "Email Address",
                "Username",
                "Contact Number",
                "Sex",
                "Clientele",
                "Highest Education",
                "City/Municipality",
            ],
            rows,
        });
    }

    return (
        <div className="p-6 space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 my-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <h1 className="text-xl font-semibold tracking-tight">
                        Job Seeker Report
                    </h1>
                </div>
            </div>

            {/* SEARCH + EXPORT */}
            <div className="my-2 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search for a job seeker"
                        className="pl-9"
                        value={find}
                        onChange={(e) => setFind(e.target.value)}
                    />
                </div>

                <Button onClick={exportPdf} className="gap-2">
                    <FileText className="h-4 w-4" />
                    Export PDF
                </Button>
            </div>

            <hr />

            {/* TABLE */}
            <JobSeekersTable
                jobSeekers={filteredJobSeekers}
                loading={loading}
            />
        </div>
    );
}
