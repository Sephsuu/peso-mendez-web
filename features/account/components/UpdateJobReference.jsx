"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { UserService } from "@/services/user.service";

export function UpdateJobReference({ open, setOpen, user, userId }) {
    const [form, setForm] = useState({
        occupationType: user?.occupation_type || "",
        occupation1: user?.occupation1 || "",
        occupation2: user?.occupation2 || "",
        occupation3: user?.occupation3 || "",
        locationType: user?.location_type || "",
        location1: user?.location1 || "",
        location2: user?.location2 || "",
        location3: user?.location3 || "",
        userId: userId,
    });

    const [loading, setLoading] = useState(false);

    function updateField(key, value) {
        setForm(prev => ({ ...prev, [key]: value }));
    }

    async function handleSubmit() {
        try {
            setLoading(true);
            if (!user || Object.keys(user).length === 0) {
                const data = await UserService.createJobReference(form);
                if (data) {
                    toast.success("Job reference created successfully!")
                    setOpen(false)
                    return;
                }
            }
            await UserService.updateUserJobReference({
                occupation_type: form.occupationType || "",
                occupation1: form.occupation1 || "",
                occupation2: form.occupation2 || "",
                occupation3: form.occupation3 || "",
                location_type: form.locationType || "",
                location1: form.location1 || "",
                location2: form.location2 || "",
                location3: form.location3 || "",
                user_id: userId,
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

                    {/* ------------------ Occupation Type ------------------ */}
                    <FormItem label="Occupation Type">
                        <Select
                            value={form.occupationType}
                            onValueChange={(val) => updateField("occupationType", val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select occupation type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Part-time">Part-time</SelectItem>
                                <SelectItem value="Full-time">Full-time</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>

                    {/* ------------------ Occupation fields ------------------ */}
                    <FormItem label="Occupation 1">
                        <Input
                            value={form.occupation1}
                            onChange={(e) => updateField("occupation1", e.target.value)}
                        />
                    </FormItem>

                    <FormItem label="Occupation 2">
                        <Input
                            value={form.occupation2}
                            onChange={(e) => updateField("occupation2", e.target.value)}
                        />
                    </FormItem>

                    <FormItem label="Occupation 3">
                        <Input
                            value={form.occupation3}
                            onChange={(e) => updateField("occupation3", e.target.value)}
                        />
                    </FormItem>

                    {/* ------------------ Location Type ------------------ */}
                    <FormItem label="Location Type">
                        <Select
                            value={form.locationType}
                            onValueChange={(val) => updateField("locationType", val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select location type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Local">Local</SelectItem>
                                <SelectItem value="Overseas">Overseas</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>

                    {/* ------------------ Locations ------------------ */}
                    <FormItem label="Location 1">
                        <Input
                            value={form.location1}
                            onChange={(e) => updateField("location1", e.target.value)}
                        />
                    </FormItem>

                    <FormItem label="Location 2">
                        <Input
                            value={form.location2}
                            onChange={(e) => updateField("location2", e.target.value)}
                        />
                    </FormItem>

                    <FormItem label="Location 3">
                        <Input
                            value={form.location3}
                            onChange={(e) => updateField("location3", e.target.value)}
                        />
                    </FormItem>

                </div>

                {/* ------------------ Footer ------------------ */}
                <DialogFooter>
                    <Button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="w-full bg-primary text-white"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function FormItem({ label, children }) {
    return (
        <div className="space-y-1">
            <Label className="text-gray-700">{label}</Label>
            {children}
        </div>
    );
}
