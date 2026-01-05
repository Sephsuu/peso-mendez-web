"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useClaims } from "@/hooks/use-claims";
import { UserService } from "@/services/user.service";
import Loader from "@/components/ui/loader";
import { UpdateLanguageProficiency } from '@/features/account/components/UpdateLanguageProficiency'
import { useFetchData } from "@/hooks/use-fetch-data";
import { Checkbox } from "@/components/ui/checkbox";

export function LanguageProficiencySection() {
    const [reload, setReload] = useState(false);
    const [open, setOpen] = useState(false);
    const { claims, loading: authLoading } = useClaims();
    const userId = claims?.id || claims?.userId;

    const { data: user, loading } = useFetchData(
        UserService.getUserLanguageProfeciency,
        [userId, reload],
        [userId],
    );

    if (authLoading || loading) return <Loader />;
    if (!user || Object.keys(user).length === 0) return (
        <div className="flex-center flex-col gap-2 w-full p-4 rounded-md bg-light shadow-sm m-2">
            <div className="font-semibold text-center">You don't have language proficiency as of now.</div>
            <Button 
                onClick={() => setOpen(true)}
                className="bg-primary mx-auto"
            >
                Fill up form
            </Button>
            <UpdateLanguageProficiency open={open} setOpen={setOpen} user={user} userId={userId} />
        </div>
    )

    return (
        <div className="w-full bg-gray-50">

            {/* HEADER */}
            <div className="bg-linear-to-l from-[#73b9ff] to-[#0a6aff] text-white px-6 py-10 md:px-16 lg:px-24">
                <h1 className="text-3xl font-semibold">Language Proficiency</h1>

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
                {/* LANGUAGE PROFICIENCY */}
                <div className="bg-white rounded-lg shadow p-5 pb-8">
                    {user.map((item) => (
                        <div className="mb-6" key={item.language}>
                            <h3 className="text-lg font-medium mb-2">{ item.language } Language:</h3>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                <InfoCheckbox label="Read" checked={item.read === 1} />
                                <InfoCheckbox label="Write" checked={item.write === 1} />
                                <InfoCheckbox label="Speak" checked={item.speak === 1} />
                                <InfoCheckbox label="Understand" checked={item.understand === 1} />
                            </div>
                        </div>
                    )) }
                    
                </div>
            </div>

            <UpdateLanguageProficiency 
                open={open} 
                setOpen={setOpen} 
                user={user} 
                userId={userId}
                setReload={setReload}
            />
        </div>
    );
}

function InfoCheckbox({ label, checked }) {
    return (
        <label className="flex items-center gap-2 text-gray-700">
            <Checkbox
                className={`w-5 h-5 rounded border flex items-center justify-center ${
                    checked ? "bg-primary text-white border-primary" : "border-gray-400"
                }`}
                checked={checked}
            >
            </Checkbox>
            <span className="text-sm">{label}</span>
        </label>
    );
}
