"use client"

import { getDecodedToken } from '@/lib/auth'
import { AdminDashboard } from '@/features/dashboard/AdminDashboard'
import { JobSeekerDashboard } from '@/features/dashboard/JobSeekerDashboard'
import { EmployerDashboard } from '@/features/dashboard/EmployerDashboard'

export function DashboardPage() {
    const claims = getDecodedToken();
    
    return (
        <>
            {claims.role === 'admin' && <AdminDashboard />}
            {claims.role === 'job_seeker' && <JobSeekerDashboard />}
            {claims.role === 'employer' && <EmployerDashboard />}
        </>
    )
}