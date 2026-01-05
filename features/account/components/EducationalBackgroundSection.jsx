"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useClaims } from "@/hooks/use-claims";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { UserService } from "@/services/user.service";
import Loader from "@/components/ui/loader";
import {
    GraduationCap,
    School,
    BookOpen,
    Calendar,
    Clock,
    CheckCircle2,
    Layers,
} from "lucide-react";
import { formatDateToWord } from "@/lib/helper";

// ✅ change this to your real modal component
import { UpdateEducationalBackground } from "./UpdateEducationalBackground";

export function EducationalBackgroundSection() {
    const [reload, setReload] = useState(false);
    const [open, setOpen] = useState(false);

    const { claims, loading: authLoading } = useClaims();
    const userId = claims?.id || claims?.userId;

    const { data: edu, loading } = useFetchOne(
        UserService.getUserEducationalBackground,   // ✅ change if needed
        [userId, reload],
        [userId]
    );

    if (authLoading || loading) return <Loader />;

    if (!edu || Object.keys(edu).length === 0) {
        return (
            <div className="flex-center flex-col gap-2 w-full p-4 rounded-md bg-light shadow-sm m-2">
                <div className="font-semibold text-center">
                    You don't have educational background yet.
                </div>
                <Button onClick={() => setOpen(true)} className="bg-primary mx-auto">
                    Fill up form
                </Button>

                <UpdateEducationalBackground
                    open={open}
                    setOpen={setOpen}
                    user={edu}
                    userId={userId}
                    setReload={setReload}
                />
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-50">
            {/* HEADER */}
            <div className="bg-linear-to-l from-[#73b9ff] to-[#0a6aff] text-white px-6 py-10 md:px-16 lg:px-24">
                <h1 className="text-3xl font-semibold flex items-center gap-2">
                    <GraduationCap size={22} />
                    Educational Background
                </h1>

                <div className="flex items-center gap-2 mt-3 text-sm opacity-90">
                    <CheckCircle2 size={16} />
                    <span>Highest Education: {edu?.highest_education || "—"}</span>
                </div>

                <div className="flex items-center gap-2 mt-1 text-sm opacity-90">
                    <Layers size={16} />
                    <span>K-12: {Number(edu?.is_kto12) === 1 ? "Yes" : "No"}</span>
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
                {/* ELEMENTARY */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <School className="w-5 h-5 text-gray-600" />
                        Elementary
                    </h2>

                    <InfoItem label="Year Graduated" value={edu.elem_year_grad} icon={Calendar} />
                    <InfoItem label="Level Reached" value={edu.elem_level_reached} icon={BookOpen} />
                    <InfoItem
                        label="Year Last Attended"
                        value={edu.elem_year_last_attended}
                        icon={Calendar}
                    />
                </div>

                {/* SECONDARY */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <School className="w-5 h-5 text-gray-600" />
                        Secondary
                    </h2>

                    <InfoItem label="Year Graduated" value={edu.seco_year_grad} icon={Calendar} />
                    <InfoItem label="Level Reached" value={edu.seco_level_reached} icon={BookOpen} />
                    <InfoItem
                        label="Year Last Attended"
                        value={edu.seco_year_last_attended}
                        icon={Calendar}
                    />
                </div>

                {/* SENIOR HIGH (if K-12 or if strand is provided) */}
                {(Number(edu?.is_kto12) === 1 || edu?.shs_strand) && (
                    <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <School className="w-5 h-5 text-gray-600" />
                            Senior High School
                        </h2>

                        <InfoItem label="SHS Strand" value={edu.shs_strand} icon={BookOpen} />
                    </div>
                )}

                {/* TERTIARY */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-gray-600" />
                        Tertiary
                    </h2>

                    <InfoItem label="Course" value={edu.ter_course} icon={BookOpen} />
                    <InfoItem label="Year Graduated" value={edu.ter_year_grad} icon={Calendar} />
                    <InfoItem label="Level Reached" value={edu.ter_level_reached} icon={BookOpen} />
                    <InfoItem
                        label="Year Last Attended"
                        value={edu.ter_year_last_attended}
                        icon={Calendar}
                    />
                </div>

                {/* GRADUATE STUDIES */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-gray-600" />
                        Graduate Studies
                    </h2>

                    <InfoItem label="Course" value={edu.gs_course} icon={BookOpen} />
                    <InfoItem label="Year Graduated" value={edu.gs_year_grad} icon={Calendar} />
                    <InfoItem label="Level Reached" value={edu.gs_level_reached} icon={BookOpen} />
                    <InfoItem
                        label="Year Last Attended"
                        value={edu.gs_year_last_attended}
                        icon={Calendar}
                    />
                </div>

                {/* DATES */}
                <div className="bg-white shadow-sm rounded-xl border p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Dates</h2>

                    <InfoItem
                        label="Filled Up"
                        value={formatDateToWord(edu.created_at)}
                        icon={Calendar}
                    />
                    <InfoItem
                        label="Last Updated"
                        value={formatDateToWord(edu.updated_at)}
                        icon={Clock}
                    />
                </div>
            </div>

            <UpdateEducationalBackground
                open={open}
                setOpen={setOpen}
                user={edu}
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
