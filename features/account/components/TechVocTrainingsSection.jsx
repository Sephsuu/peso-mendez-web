"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useClaims } from "@/hooks/use-claims";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { UserService } from "@/services/user.service";
import Loader from "@/components/ui/loader";
import {
    Calendar,
    Clock,
    GraduationCap,
    Building2,
    BadgeCheck,
    Sparkles,
} from "lucide-react";
import { formatDateToWord } from "@/lib/helper";
import { UpdateTechVocTraining } from "@/features/account/components/UpdateTechVocTrainings";

const SLOT_COUNT = 3;

export function TechVocTrainingsSection() {
    const [reload, setReload] = useState(false);
    const [open, setOpen] = useState(false);

    const { claims, loading: authLoading } = useClaims();
    const userId = claims?.id || claims?.userId;

    const { data: trainingsRaw, loading } = useFetchOne(
        UserService.getUserTechVocTrainings,
        [userId, reload],
        [userId]
    );

    const trainings = Array.isArray(trainingsRaw) ? trainingsRaw : [];

    const slots = useMemo(() => {
        const fixed = new Array(SLOT_COUNT).fill(null).map(() => ({}));
        for (let i = 0; i < SLOT_COUNT; i++) {
            fixed[i] = trainings[i] ?? {};
        }
        return fixed;
    }, [trainings]);

    const lastUpdated = useMemo(() => {
        const dates = trainings
            .map((x) => x?.updated_at || x?.created_at)
            .filter(Boolean)
            .map((d) => new Date(d).getTime());

        if (dates.length === 0) return null;

        return new Date(Math.max(...dates)).toISOString();
    }, [trainings]);

    if (authLoading || loading) return <Loader />;

    if (!trainingsRaw || trainingsRaw.length === 0) {
        return (
            <div className="flex-center flex-col gap-2 w-full p-4 rounded-md bg-light shadow-sm m-2">
                <div className="font-semibold text-center">
                    You don't have technical/vocational trainings yet.
                </div>
                <Button onClick={() => setOpen(true)} className="bg-primary mx-auto">
                    Fill up form
                </Button>
                <UpdateTechVocTraining
                    open={open}
                    setOpen={setOpen}
                    user={trainingsRaw}
                    userId={userId}
                    setReload={setReload}
                />
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-50">

            {/* HEADER (same vibe as PersonalInformationSection) */}
            <div className="bg-linear-to-l from-[#73b9ff] to-[#0a6aff] text-white px-6 py-10 md:px-16 lg:px-24">
                <h1 className="text-3xl font-semibold">TechVoc and Other Trainings</h1>

                <div className="flex items-center gap-2 mt-3 text-sm opacity-90">
                    <GraduationCap size={16} />
                    <span>Fixed Trainings: {SLOT_COUNT}</span>
                </div>

                <div className="flex items-center gap-2 mt-1 text-sm opacity-90">
                    <Clock size={16} />
                    <span>
                        Last Updated: {lastUpdated ? formatDateToWord(lastUpdated) : "—"}
                    </span>
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

                {slots.map((item, idx) => (
                    <div
                        key={`techvoc-${idx}`}
                        className="bg-white shadow-sm rounded-xl border p-5 space-y-4"
                    >
                        <h2 className="text-lg font-semibold text-gray-800">
                            TechVoc Training {idx + 1}
                        </h2>

                        <InfoItem
                            label="Course"
                            value={item.course}
                            icon={GraduationCap}
                        />
                        <InfoItem
                            label="Hrs. of Training"
                            value={item.hours_training}
                            icon={Calendar}
                        />
                        <InfoItem
                            label="Institution"
                            value={item.institution}
                            icon={Building2}
                        />
                        <InfoItem
                            label="Skills Acquired"
                            value={item.skills_acquired}
                            icon={Sparkles}
                        />
                        <InfoItem
                            label="Certificate Received"
                            value={item.cert_received}
                            icon={BadgeCheck}
                        />

                        <div className="pt-2">
                            <InfoItem
                                label="Filled Up"
                                value={item.created_at ? formatDateToWord(item.created_at) : "—"}
                                icon={Calendar}
                            />
                            <InfoItem
                                label="Last Updated"
                                value={item.updated_at ? formatDateToWord(item.updated_at) : "—"}
                                icon={Clock}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* EDIT MODAL (we’ll implement next) */}
            <UpdateTechVocTraining
                open={open}
                setOpen={setOpen}
                user={trainingsRaw}      // array from API
                userId={userId}
                setReload={setReload}
            />
        </div>
    );
}

/* ================= REUSABLE (same as your reference) ================= */

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
