"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { UserService } from "@/services/user.service";
import { caviteLocations } from "@/lib/utils";

const trim = (v) => (v ?? "").trim();

export function UpdateJobReference({ open, setOpen, user, userId, setReload }) {
    const [formData, setFormData] = useState({
        occupation_type: user?.occupation_type ?? "",
        occupation1: user?.occupation1 ?? "",
        occupation2: user?.occupation2 ?? "",
        occupation3: user?.occupation3 ?? "",
        location_type: user?.location_type ?? "",
        location1: user?.location1 ?? "",
        location2: user?.location2 ?? "",
        location3: user?.location3 ?? "",
    });

    const [loading, setLoading] = useState(false);

    const isExisting = useMemo(() => {
        return !!(user && Object.keys(user).length > 0);
        // If you have id for job reference, better:
        // return !!user?.id;
    }, [user]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validation = useMemo(() => {
        const required = [
            { key: "occupation_type", label: "Occupation Type" },
            { key: "occupation1", label: "Preferred Occupation 1" },
            { key: "occupation2", label: "Preferred Occupation 2" },
            { key: "occupation3", label: "Preferred Occupation 3" },
            { key: "location_type", label: "Location Type" },
            { key: "location1", label: "Preferred Work Location 1" },
            { key: "location2", label: "Preferred Work Location 2" },
            { key: "location3", label: "Preferred Work Location 3" },
        ];

        for (const f of required) {
            if (!trim(formData[f.key])) {
                return { ok: false, message: `${f.label} is required.` };
            }
        }

        return { ok: true, message: "" };
    }, [formData]);

    async function handleSubmit() {
        if (!validation.ok) {
            toast.error(validation.message);
            return;
        }

        try {
            setLoading(true);

            const payload = {
                user_id: userId,
                occupation_type: trim(formData.occupation_type),
                occupation1: trim(formData.occupation1),
                occupation2: trim(formData.occupation2),
                occupation3: trim(formData.occupation3),
                location_type: trim(formData.location_type),
                location1: trim(formData.location1),
                location2: trim(formData.location2),
                location3: trim(formData.location3),
            };

            const createPayload = {
                userId: userId,
                occupationType: trim(formData.occupation_type),
                occupation1: trim(formData.occupation1),
                occupation2: trim(formData.occupation2),
                occupation3: trim(formData.occupation3),
                locationType: trim(formData.location_type),
                location1: trim(formData.location1),
                location2: trim(formData.location2),
                location3: trim(formData.location3),
            };

            if (!isExisting) {
                // ✅ CREATE if no object exists
                // Change method name if yours is different
                await UserService.createJobReference(createPayload);
                toast.success("Job reference created successfully!");
            } else {
                // ✅ UPDATE if object exists
                await UserService.updateUserJobReference(payload);
                toast.success("Job reference updated successfully!");
            }

            if (setReload) setReload((prev) => !prev);
            setOpen(false);
        } catch (err) {
            toast.error(err?.message || "Failed to save job reference.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {isExisting ? "Edit Job Reference" : "Create Job Reference"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-5 py-4">
                    <SelectGroupField
                        label="Occupation Type *"
                        value={formData.occupation_type}
                        onValueChange={(val) => handleChange("occupation_type", val)}
                        items={["Part-time", "Full-time"]}
                    />

                    <div className="grid grid-cols-1 gap-4">
                        <InputGroup
                            label="Preferred Occupation 1 *"
                            value={formData.occupation1}
                            onChange={(e) => handleChange("occupation1", e.target.value)}
                        />
                        <InputGroup
                            label="Preferred Occupation 2 *"
                            value={formData.occupation2}
                            onChange={(e) => handleChange("occupation2", e.target.value)}
                        />
                        <InputGroup
                            label="Preferred Occupation 3 *"
                            value={formData.occupation3}
                            onChange={(e) => handleChange("occupation3", e.target.value)}
                        />
                    </div>

                    <SelectGroupField
                        label="Location Type *"
                        value={formData.location_type}
                        onValueChange={(val) => handleChange("location_type", val)}
                        items={["Local", "Overseas"]}
                    />

                    <div className="grid grid-cols-1 gap-4">
                        {formData.location_type === "Local" ? (
                            <>
                                <SelectGroupField
                                    label="Preferred Work Location 1 *"
                                    value={formData.location1}
                                    onValueChange={(val) => handleChange("location1", val)}
                                    items={caviteLocations}
                                />
                                <SelectGroupField
                                    label="Preferred Work Location 2 *"
                                    value={formData.location2}
                                    onValueChange={(val) => handleChange("location2", val)}
                                    items={caviteLocations}
                                />
                                <SelectGroupField
                                    label="Preferred Work Location 3 *"
                                    value={formData.location3}
                                    onValueChange={(val) => handleChange("location3", val)}
                                    items={caviteLocations}
                                />
                            </>
                        ) : (
                            <>
                                <InputGroup
                                    label="Preferred Work Location 1 *"
                                    value={formData.location1}
                                    onChange={(e) => handleChange("location1", e.target.value)}
                                />
                                <InputGroup
                                    label="Preferred Work Location 2 *"
                                    value={formData.location2}
                                    onChange={(e) => handleChange("location2", e.target.value)}
                                />
                                <InputGroup
                                    label="Preferred Work Location 3 *"
                                    value={formData.location3}
                                    onChange={(e) => handleChange("location3", e.target.value)}
                                />
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex justify-end">
                    <Button
                        disabled={loading || !validation.ok}
                        onClick={handleSubmit}
                        className="bg-primary text-white"
                        title={!validation.ok ? validation.message : ""}
                    >
                        {loading ? "Saving..." : isExisting ? "Save Changes" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* ================= Reusable ================= */

function InputGroup({ label, value, onChange }) {
    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            <Input
                value={value}
                onChange={onChange}
                className="border-primary/30 focus-visible:ring-primary w-full"
            />
        </div>
    );
}

function SelectGroupField({ label, value, onValueChange, items }) {
    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="border-primary/30 focus-visible:ring-primary w-full">
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{label}</SelectLabel>
                        {items.map((item) => (
                            <SelectItem key={item} value={item}>
                                {item}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
