"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { UserService } from "@/services/user.service";
import { caviteLocations } from "@/lib/utils";

export function UpdateJobReference({ open, setOpen, user, userId }) {
    const [formData, setFormData] = useState({
        occupationType: user?.occupation_type ?? "",
        occupation1: user?.occupation1 ?? "",
        occupation2: user?.occupation2 ?? "",
        occupation3: user?.occupation3 ?? "",
        locationType: user?.location_type ?? "",
        location1: user?.location1 ?? "",
        location2: user?.location2 ?? "",
        location3: user?.location3 ?? "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    async function handleSubmit() {
        try {
            setLoading(true);

            await UserService.updateUserJobReference({
                user_id: userId,
                occupation_type: formData.occupationType || null,
                occupation1: formData.occupation1 || null,
                occupation2: formData.occupation2 || null,
                occupation3: formData.occupation3 || null,
                location_type: formData.locationType || null,
                location1: formData.location1 || null,
                location2: formData.location2 || null,
                location3: formData.location3 || null,
            });

            toast.success("Job reference updated successfully!");
            setOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to update job reference.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Edit Job Reference
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-5 py-4">

                    {/* Occupation Type */}
                    <SelectGroup
                        label="Occupation Type"
                        value={formData.occupationType}
                        onValueChange={(val) => handleChange("occupationType", val)}
                        items={["Part-time", "Full-time"]}
                    />

                    {/* Occupations */}
                    <div className="grid grid-cols-1 gap-4">
                        <InputGroup
                            label="Preferred Occupation 1"
                            value={formData.occupation1}
                            onChange={(e) => handleChange("occupation1", e.target.value)}
                        />
                        <InputGroup
                            label="Preferred Occupation 2"
                            value={formData.occupation2}
                            onChange={(e) => handleChange("occupation2", e.target.value)}
                        />
                        <InputGroup
                            label="Preferred Occupation 3"
                            value={formData.occupation3}
                            onChange={(e) => handleChange("occupation3", e.target.value)}
                        />
                    </div>

                    {/* Location Type */}
                    <SelectGroup
                        label="Location Type"
                        value={formData.locationType}
                        onValueChange={(val) => handleChange("locationType", val)}
                        items={["Local", "Overseas"]}
                    />

                    {/* Locations */}
                    <div className="grid grid-cols-1 gap-4">
                        {formData.locationType === "Local" ? (
                            <>
                                <SelectGroup
                                    label="Preferred Work Location 1"
                                    value={formData.location1}
                                    onValueChange={(val) => handleChange("location1", val)}
                                    items={caviteLocations}
                                />
                                <SelectGroup
                                    label="Preferred Work Location 2"
                                    value={formData.location2}
                                    onValueChange={(val) => handleChange("location2", val)}
                                    items={caviteLocations}
                                />
                                <SelectGroup
                                    label="Preferred Work Location 3"
                                    value={formData.location3}
                                    onValueChange={(val) => handleChange("location3", val)}
                                    items={caviteLocations}
                                />
                            </>
                        ) : (
                            <>
                                <InputGroup
                                    label="Preferred Work Location 1"
                                    value={formData.location1}
                                    onChange={(e) => handleChange("location1", e.target.value)}
                                />
                                <InputGroup
                                    label="Preferred Work Location 2"
                                    value={formData.location2}
                                    onChange={(e) => handleChange("location2", e.target.value)}
                                />
                                <InputGroup
                                    label="Preferred Work Location 3"
                                    value={formData.location3}
                                    onChange={(e) => handleChange("location3", e.target.value)}
                                />
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex justify-end">
                    <Button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="bg-primary text-white"
                    >
                        {loading ? "Saving..." : "Save Changes"}
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

function SelectGroup({ label, value, onValueChange, items }) {
    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="border-primary/30 focus-visible:ring-primary w-full">
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    {items.map((item) => (
                        <SelectItem key={item} value={item}>
                            {item}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
