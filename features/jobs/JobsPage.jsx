"use client"

import { JobListingPage } from "./components/JobListings";
import { JobPostings } from "./components/JobPostings";
import { useClaims } from "@/hooks/use-claims";

export function JobsPage() {
    const { claims, loading: authLoading } = useClaims();;
    const role = claims?.role;

    if (authLoading) return <div>Loading</div>;
    return (
        <>
            {role === "job_seeker" && <JobListingPage />}
            {role === "employer" && <JobPostings />}
        </>
    )
}