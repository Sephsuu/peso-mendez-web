"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UpdatePersonalInformation } from "./UpdatePersonalInformation";
import { useClaims } from "@/hooks/use-claims";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { UserService } from "@/services/user.service";
import Loader from "@/components/ui/loader";
import { Calendar, Transgender } from "lucide-react";

export function PersonalInformationSection() {
    const [open, setOpen] = useState(false);
    const { claims, loading: authLoading } = useClaims();
    const userId = claims?.id || claims?.userId;
    const { data: user, loading } = useFetchOne(UserService.getUserPersonalInformation, [userId], [userId]);

    const fullname = `${user?.surname ?? ""} ${user?.first_name ?? ""} ${
        user?.middle_name ? user.middle_name[0] + "." : ""
    }`;


    if (authLoading || loading) return <Loader />
    if (!user || Object.keys(user).length === 0) return (
        <div className="flex-center flex-col gap-2 w-full p-4 rounded-md bg-light shadow-sm m-2">
            <div className="font-semibold text-center">You don't have personal information as of now.</div>
            <Button 
                onClick={() => setOpen(true)}
                className="bg-primary mx-auto"
            >
                Fill up form
            </Button>
            <UpdatePersonalInformation open={open} setOpen={setOpen} user={user} userId={userId}/>
        </div>
    )

    return (
        <div className="w-full bg-gray-50">

            {/* HEADER WITH BLUE GRADIENT */}
            <div className="bg-linear-to-l from-[#73b9ff] to-[#0a6aff] text-white px-6 py-10 md:px-16 lg:px-24">
                <h1 className="text-3xl font-semibold">{ fullname }</h1>

                <div className="flex items-center gap-2 mt-3 text-sm opacity-90">
                    <Calendar size={16} />
                    <span>{ user.date_of_birth }</span>
                </div>

                <div className="flex items-center gap-2 mt-1 text-sm opacity-90">
                    <Transgender size={16} />
                    <span>{ user.sex }</span>
                </div>

                <Button 
                    variant="secondary"
                    onClick={() => setOpen(true)}
                    className="mt-5 bg-light"
                >
                    Edit Information
                </Button>
            </div>


            {/* DETAILS SECTION */}
           <div className="px-6 py-8 space-y-6">

                {/* ============== SECTION GROUP ============== */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>

                    <InfoItem label="Religion" value={user.religion} icon="🙏" />

                    <InfoItem label="Present Address" value={user.present_address} icon="📍" />

                    <InfoItem label="TIN Number" value={user.tin} icon="🧾" />
                </div>

                {/* ============== SECTION GROUP ============== */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Personal Status</h2>

                    <InfoItem label="Civil Status" value={user.civil_status} icon="❤️" />

                    <InfoItem label="Disability" value={user.disability || 'N/A'} icon="♿" />
                </div>

                {/* ============== SECTION GROUP ============== */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Employment Details</h2>

                    <InfoItem label="Employment Status" value={user.employment_status} icon="💼" />

                    <InfoItem label="Employment Type" value={user.employment_type} icon="📌" />

                    <InfoItem label="Are you an OFW?" value={user.is_ofw} icon="✈️" />

                    <InfoItem label="Former OFW?" value={user.is_former_ofw} icon="🌍" />
                </div>

                {/* ============== SECTION GROUP ============== */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Dates</h2>

                    <InfoItem label="Filled up on" value={formatDate(user.created_at)} icon="🗓️" />

                    <InfoItem label="Last Updated" value={formatDate(user.updated_at)} icon="⏱️" />
                </div>

            </div>

            <UpdatePersonalInformation open={open} setOpen={setOpen} user={user} userId={userId}/>
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <div>
            <p className="font-semibold text-gray-700">{label}:</p>
            <p className="text-gray-600 text-sm">{value}</p>
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
