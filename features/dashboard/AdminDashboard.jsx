"use client";

import React, { Fragment, useMemo } from "react";
import { useClaims } from "@/hooks/use-claims";
import { Users, Building2, BriefcaseBusiness, Megaphone } from "lucide-react";
import { EmployerVerificationQueue } from "./admin/EmployerVerificationQueue";
import { ClienteleDistribution } from "./admin/ClienteleDistribution";
import { useFetchData } from "@/hooks/use-fetch-data";
import { UserService } from "@/services/user.service";
import { AnnouncementService } from "@/services/announcement.service";
import { SectionLoader } from "@/components/ui/loader";

function StatCard({ label, value, Icon }) {
    return (
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-slate-700">{label}</p>
                    <p className="mt-2 text-3xl font-semibold leading-none text-slate-900">
                        {value}
                    </p>
                </div>

                <div className="h-10 w-10 rounded-xl bg-purple-50 ring-1 ring-purple-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-purple-700" />
                </div>
            </div>
        </div>
    );
}

export function AdminDashboard() {
    const { claims, loading: loadingClaims } = useClaims();

    const { data: usersData, loading: loadingUsers } = useFetchData(
        UserService.getAllUsers
    );

    const { data: announcementsData, loading: loadingAnnouncements } = useFetchData(
        AnnouncementService.getAllAnnouncements
    );

    const users = Array.isArray(usersData) ? usersData : [];
    const announcements = Array.isArray(announcementsData) ? announcementsData : [];

    const isLoading = loadingClaims || loadingUsers || loadingAnnouncements;

    const stats = useMemo(() => {
        const activeUsers = users.filter((u) => u?.status === "active");
        const activeEmployers = activeUsers.filter((u) => u?.role === "employer");
        const activeJobSeekers = activeUsers.filter((u) => u?.role === "job_seeker");

        return [
            { label: "Total Users", value: activeUsers.length, Icon: Users },
            { label: "Employers", value: activeEmployers.length, Icon: Building2 },
            { label: "Job Seekers", value: activeJobSeekers.length, Icon: BriefcaseBusiness },
            { label: "Announcements", value: announcements.length, Icon: Megaphone },
        ];
    }, [users, announcements]);

    return (
        <section className="min-h-screen bg-purple-50">
            <main className="mx-auto max-w-5xl px-4 py-6 pb-12">
                {isLoading ? (
                    <SectionLoader />
                ) : (
                    <Fragment>
                        <div className="text-center">
                            <h1 className="text-2xl font-semibold text-slate-900">
                                Administrator Dashboard
                            </h1>
                        </div>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {stats.map((s) => (
                                <StatCard
                                    key={s.label}
                                    label={s.label}
                                    value={s.value}
                                    Icon={s.Icon}
                                />
                            ))}
                        </div>
                    </Fragment>
                )}
                
                <div className="space-y-6">
                    <EmployerVerificationQueue />
                    <ClienteleDistribution />
                </div>

                
            </main>
        </section>
    );
}
