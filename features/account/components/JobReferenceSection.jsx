"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useClaims } from "@/hooks/use-claims";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { UserService } from "@/services/user.service";
import Loader from "@/components/ui/loader";
import { Briefcase, MapPin } from "lucide-react";
import { UpdateJobReference } from '@/features/account/components/UpdateJobReference'

export function JobReferenceSection() {
    const [open, setOpen] = useState(false);
    const { claims, loading: authLoading } = useClaims();
    const userId = claims?.id || claims?.userId;

    const { data: user, loading } = useFetchOne(
        UserService.getUserJobReference,
        [userId],
        [userId],
    );

    console.log('Section',user);
    

    if (authLoading || loading) return <Loader />;
    if (!user || Object.keys(user).length === 0) return (
        <div className="flex-center flex-col gap-2 w-full p-4 rounded-md bg-light shadow-sm m-2">
            <div className="font-semibold text-center">You don't have job reference as of now.</div>
            <Button 
                onClick={() => setOpen(true)}
                className="bg-primary mx-auto"
            >
                Fill up form
            </Button>
            <UpdateJobReference open={open} setOpen={setOpen} user={user} userId={userId} />
        </div>
    )

    return (
        <div className="w-full bg-gray-50">

            {/* HEADER */}
            <div className="bg-linear-to-l from-[#73b9ff] to-[#0a6aff] text-white px-6 py-10 md:px-16 lg:px-24">
                <h1 className="text-3xl font-semibold">Job Reference</h1>

                <div className="flex items-center gap-2 mt-3 text-sm opacity-90">
                    <Briefcase size={16} />
                    <span>{user.occupation_type ?? "No occupation type"}</span>
                </div>

                <div className="flex items-center gap-2 mt-1 text-sm opacity-90">
                    <MapPin size={16} />
                    <span>{user.location_type ?? "No location type"}</span>
                </div>

                {claims?.role !== "employer" && (
                    <Button
                        variant="secondary"
                        className="mt-5 bg-light"
                        onClick={() => setOpen(true)}
                    >
                        Edit Information
                    </Button>
                )}
            </div>

            {/* DETAILS */}
            <div className="px-6 py-8 space-y-6">

                {/* Occupations */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Occupations</h2>

                    <InfoItem label="Occupation 1" value={user.occupation1} icon="🧑‍🏭" />
                    <InfoItem label="Occupation 2" value={user.occupation2} icon="🏭" />
                    <InfoItem label="Occupation 3" value={user.occupation3} icon="🧰" />
                </div>

                {/* Locations */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Preferred Locations</h2>

                    <InfoItem label="Location 1" value={user.location1} icon="📍" />
                    <InfoItem label="Location 2" value={user.location2} icon="🌏" />
                    <InfoItem label="Location 3" value={user.location3} icon="🗺️" />
                </div>

                {/* Dates */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Dates</h2>

                    <InfoItem label="Filled Up" value={formatDate(user.created_at)} icon="🗓️" />
                </div>
            </div>

            <UpdateJobReference open={open} setOpen={setOpen} user={user} userId={userId}/>
        </div>
    );
}

function InfoItem({ label, value, icon }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b last:border-none">
            <div className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <span className="font-medium text-gray-700">{label}</span>
            </div>
            <span className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-0 text-right">
                {value || "—"}
            </span>
        </div>
    );
}

function formatDate(date) {
    try {
        return new Date(date).toLocaleDateString();
    } catch {
        return date;
    }
}
