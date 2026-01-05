"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserService } from "@/services/user.service";

const SLOT_COUNT = 3;

const fields = [
    { key: "course", label: "Course" },
    { key: "hours_training", label: "Hrs. of Training" },
    { key: "institution", label: "Institution" },
    { key: "skills_acquired", label: "Skills Acquired" },
    { key: "cert_received", label: "Certificate Received" },
];

const trim = (v) => (v ?? "").trim();

function makeBlankTraining(userId) {
    return {
        id: null,
        user_id: userId,
        course: "",
        hours_training: "",
        institution: "",
        skills_acquired: "",
        cert_received: "",
    };
}

function normalizeToThree(user, userId) {
    const list = Array.isArray(user) ? user : [];
    const out = [];

    for (let i = 0; i < SLOT_COUNT; i++) {
        const row = list[i];

        out.push({
            id: row?.id ?? null,
            user_id: row?.user_id ?? userId,
            course: row?.course ?? "",
            hours_training: row?.hours_training ?? "",
            institution: row?.institution ?? "",
            skills_acquired: row?.skills_acquired ?? "",
            cert_received: row?.cert_received ?? "",
        });
    }

    // if totally empty, still return 3 blanks
    while (out.length < SLOT_COUNT) out.push(makeBlankTraining(userId));

    return out.slice(0, SLOT_COUNT);
}

export function UpdateTechVocTraining({ open, setOpen, user, userId, setReload }) {
    const initialTrainings = useMemo(() => {
        return normalizeToThree(user, userId);
    }, [user, userId]);

    const [trainings, setTrainings] = useState(initialTrainings);
    const [loading, setLoading] = useState(false);

    // ✅ THIS IS THE IMPORTANT FIX:
    // Whenever modal opens OR user prop updates, sync state
    useEffect(() => {
        if (!open) return;
        setTrainings(initialTrainings);
    }, [open, initialTrainings]);

    function updateTraining(index, field, value) {
        setTrainings((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    }

    const validation = useMemo(() => {
        for (let i = 0; i < SLOT_COUNT; i++) {
            for (const f of fields) {
                if (!trim(trainings[i]?.[f.key])) {
                    return {
                        ok: false,
                        message: `TechVoc Training ${i + 1}: ${f.label} is required.`,
                    };
                }
            }
        }
        return { ok: true, message: "" };
    }, [trainings]);

    async function handleSubmit() {
        if (!validation.ok) {
            toast.error(validation.message);
            return;
        }

        try {
            setLoading(true);

            // If backend already created 3 rows, all 3 should have IDs.
            // If not, create missing rows first, then update.
            const existing = Array.isArray(user) ? user : [];
            const missingCount = SLOT_COUNT - existing.length;

            if (missingCount > 0) {
                for (let i = 0; i < missingCount; i++) {
                    await UserService.createTechVocTraining({
                        userId: userId,
                        course: trim(trainings[existing.length + i].course),
                        hoursTraining: trim(trainings[existing.length + i].hours_training),
                        institution: trim(trainings[existing.length + i].institution),
                        skillsAcquired: trim(trainings[existing.length + i].skills_acquired),
                        certReceived: trim(trainings[existing.length + i].cert_received),
                    });
                }
            }

            // update existing (and newly created if you re-fetch in parent via setReload)
            for (let i = 0; i < Math.min(existing.length, SLOT_COUNT); i++) {
                const payload = {
                    id: existing[i].id,
                    user_id: userId,
                    course: trim(trainings[i].course),
                    hours_training: trim(trainings[i].hours_training),
                    institution: trim(trainings[i].institution),
                    skills_acquired: trim(trainings[i].skills_acquired),
                    cert_received: trim(trainings[i].cert_received),
                };

                await UserService.updateUserTechVocTraining(payload);
            }

            toast.success("TechVoc trainings saved!");
            if (setReload) setReload((prev) => !prev);
            setOpen(false);
        } catch (err) {
            toast.error(err?.message || "Failed to save techvoc trainings.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Edit TechVoc and Other Trainings
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {trainings.map((t, idx) => (
                        <div
                            key={`training-${idx}`}
                            className="rounded-xl border bg-white p-4 shadow-sm space-y-4"
                        >
                            <div className="font-semibold text-gray-800">
                                TechVoc Training {idx + 1}
                            </div>

                            <div className="">
                                {fields.map((f) => (
                                    <InputGroup
                                        key={`${idx}-${f.key}`}
                                        label={`${f.label} *`}
                                        value={t[f.key] ?? ""}
                                        onChange={(e) =>
                                            updateTraining(idx, f.key, e.target.value)
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter className="flex justify-end">
                    <Button
                        disabled={loading || !validation.ok}
                        onClick={handleSubmit}
                        className="bg-primary text-white"
                        title={!validation.ok ? validation.message : ""}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function InputGroup({ label, value, onChange }) {
    return (
        <div className="space-y-1 my-4">
            <Label>{label}</Label>
            <Input
                value={value}
                onChange={onChange}
                className="border-primary/30 focus-visible:ring-primary w-full"
            />
        </div>
    );
}
