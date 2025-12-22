"use client"

import { ViewJobSeekerApplications } from "@/features/applications/components/ViewJobSeekerApplications"
import { ViewEmployerApplications } from "@/features/applications/components/ViewEmployerApplications"
import { useClaims } from "@/hooks/use-claims";

export function ApplicationsPage() {  
    const { claims, loading: authLoading } = useClaims();
    const role = claims?.role || claims?.role;

    if (authLoading) return <div>Loading</div>
    return (
        <>
            {role === "job_seeker" && <ViewJobSeekerApplications />}
            {role === "employer" && <ViewEmployerApplications />}
        </>
    )
}