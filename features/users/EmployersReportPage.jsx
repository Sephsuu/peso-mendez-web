"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, Search } from "lucide-react";
import { VerificationService } from "@/services/verification.service";
import { EmployersTable } from "./components/EmployersTable";
import { useClaims } from "@/hooks/use-claims";

const tabs = [
    "Verified Employers",
    "Pending Employers",
    "Rejected Employers",
    "Idle Employers",
];

export function EmployersReportPage() {
    const { claims, loading: authLoading } = useClaims();
    const [loading, setLoading] = useState(true);
    const [find, setFind] = useState("");
    const [activeTab, setActiveTab] = useState("Verified Employers");
    const [initialEmployers, setInitialEmployers] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [filteredEmployers, setFilteredEmployers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await VerificationService.getVerificationsByRole("");
                setInitialEmployers(res);
            } catch (e) {
                alert("Error: " + e);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Filter by tab
    useEffect(() => {
        let filtered = [];

        if (activeTab === "Verified Employers") {
            filtered = initialEmployers.filter(
                (e) => e.status === "approved"
            );
        } else if (activeTab === "Rejected Employers") {
            filtered = initialEmployers.filter(
                (e) => e.status === "rejected"
            );
        } else if (activeTab === "Idle Employers") {
            filtered = initialEmployers.filter(
                (e) => e.status == null
            );
        } else {
            filtered = initialEmployers.filter(
                (e) => e.status === "pending"
            );
        }

        setEmployers(filtered);
    }, [activeTab, initialEmployers]);

    // Search filter
    useEffect(() => {
        if (!find) {
            setFilteredEmployers(employers);
        } else {
            const keyword = find.toLowerCase();
            setFilteredEmployers(
                employers.filter(
                    (e) =>
                        (e.full_name || "")
                            .toLowerCase()
                            .includes(keyword) ||
                        (e.email || "")
                            .toLowerCase()
                            .includes(keyword)
                )
            );
        }
    }, [find, employers]);

    function exportPdf() {
        const rows = PdfExporter.mapToRowList({
            data: initialEmployers,
            keys: [
                "full_name",
                "email",
                "username",
                "contact",
                "employer_type",
                "sex",
                "highest_education",
                "citmun",
            ],
        });

        PdfExporter.exportTable({
            title: "Active Employers Report",
            headers: [
                "Full Name",
                "Email Address",
                "Username",
                "Contact Number",
                "Employer Type",
                "Gender",
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
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <h1 className="text-xl font-semibold tracking-tight">
                        Employers Report
                    </h1>
                </div>
            </div>

            <hr />

            {/* TABS */}
            <div className="flex gap-2 overflow-x-auto">
                {tabs.map((tab) => (
                    <Button
                        key={tab}
                        variant={activeTab === tab ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </Button>
                ))}
            </div>

            {/* SEARCH + EXPORT */}
            <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search for an employer"
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

            {/* TABLE */}
            <EmployersTable
                claims={claims}
                activeTab={activeTab}
                loading={loading}
                employers={filteredEmployers}
            />
        </div>
    );
}
