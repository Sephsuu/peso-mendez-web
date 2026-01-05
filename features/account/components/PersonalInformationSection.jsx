"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UpdatePersonalInformation } from "./UpdatePersonalInformation";
import { useClaims } from "@/hooks/use-claims";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { UserService } from "@/services/user.service";
import Loader from "@/components/ui/loader";
import {
    Calendar,
    Transgender,
    MapPin,
    Heart,
    Accessibility,
    Briefcase,
    Plane,
    Clock,
    FilePenLine,
} from "lucide-react";
import { formatDateToWord } from "@/lib/helper";

export function PersonalInformationSection() {
    const [reload, setReload] = useState(false);
    const [open, setOpen] = useState(false);
    const { claims, loading: authLoading } = useClaims();
    const userId = claims?.id || claims?.userId;

    const { data: user, loading } = useFetchOne(
        UserService.getUserPersonalInformation,
        [userId, reload],
        [userId]
    );

    const fullName = `${user?.surname ?? ""}, ${user?.first_name ?? ""} ${
        user?.middle_name ? user.middle_name[0] + "." : ""
    }`;

    if (authLoading || loading) return <Loader />;

    if (!user || Object.keys(user).length === 0) {
        return (
            <div className="flex-center flex-col gap-2 w-full p-4 rounded-md bg-light shadow-sm m-2">
                <div className="font-semibold text-center">
                    You don't have personal information yet.
                </div>
                <Button onClick={() => setOpen(true)} className="bg-primary mx-auto">
                    Fill up form
                </Button>
                <UpdatePersonalInformation
                    open={open}
                    setOpen={setOpen}
                    user={user}
                    userId={userId}
                />
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-50">

            {/* HEADER */}
            <div className="bg-linear-to-l from-[#73b9ff] to-[#0a6aff] text-white px-6 py-10 md:px-16 lg:px-24">
                <h1 className="text-3xl font-semibold">{fullName}</h1>

                <div className="flex items-center gap-2 mt-3 text-sm opacity-90">
                    <Calendar size={16} />
                    <span>{formatDate(user.date_of_birth)}</span>
                </div>

                <div className="flex items-center gap-2 mt-1 text-sm opacity-90">
                    <Transgender size={16} />
                    <span>{user.sex ?? "Not specified"}</span>
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

                {/* BASIC INFO */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Basic Information
                    </h2>

                    <InfoItem label="Religion" value={user.religion} icon={Heart} />
                    <InfoItem
                        label="Present Address"
                        value={user.present_address}
                        icon={MapPin}
                    />
                    <InfoItem label="City/Municipality" value={user.citmun} icon={MapPin} />
                    <InfoItem label="TIN Number" value={user.tin} icon={FilePenLine} />
                </div>

                {/* PERSONAL STATUS */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Personal Status
                    </h2>

                    <InfoItem
                        label="Civil Status"
                        value={user.civil_status}
                        icon={Heart}
                    />
                    <InfoItem
                        label="Disability"
                        value={user.disability || "N/A"}
                        icon={Accessibility}
                    />
                </div>

                {/* EMPLOYMENT */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Employment Details
                    </h2>

                    <InfoItem
                        label="Employment Status"
                        value={user.employment_status}
                        icon={Briefcase}
                    />
                    <InfoItem
                        label="Employment Type"
                        value={user.employment_type}
                        icon={Briefcase}
                    />
                    <InfoItem
                        label="Are you an OFW?"
                        value={user.is_ofw}
                        icon={Plane}
                    />
                    <InfoItem
                        label="Former OFW?"
                        value={user.is_former_ofw}
                        icon={Plane}
                    />
                </div>

                {/* DATES */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Dates</h2>

                    <InfoItem
                        label="Filled Up"
                        value={formatDateToWord(user.created_at)}
                        icon={Calendar}
                    />
                    <InfoItem
                        label="Last Updated"
                        value={formatDateToWord(user.updated_at)}
                        icon={Clock}
                    />
                </div>
            </div>

            <UpdatePersonalInformation
                open={open}
                setOpen={setOpen}
                user={user}
                userId={userId}
                setReload={setReload}
            />
        </div>
    );
}

/* ================= REUSABLE ================= */

function InfoItem({ label, value, icon: Icon }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b last:border-none">
            <div className="flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-gray-500" />}
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
