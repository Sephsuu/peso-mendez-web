"use client";

import { useClaims } from "@/hooks/use-claims";
import { AdminDashboard } from "@/features/dashboard/AdminDashboard";
import { JobSeekerDashboard } from "@/features/dashboard/JobSeekerDashboard";
import { EmployerDashboard } from "@/features/dashboard/EmployerDashboard";

export function DashboardPage() {
    const { claims, loading } = useClaims();
    
    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!claims) {
        return <div className="flex h-screen items-center justify-center">Unauthorized</div>;
    }

    return (
        <>
            {claims.role === "admin" && <AdminDashboard />}
            {claims.role === "job_seeker" && <JobSeekerDashboard />}
            {claims.role === "employer" && <EmployerDashboard />}
        </>
    );
}
