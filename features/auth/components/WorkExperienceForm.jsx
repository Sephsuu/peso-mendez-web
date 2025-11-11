"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/user.service";

export function WorkExperienceForm({ userId, fromProfile = false, setSection }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Initialize 3 work experience entries
    const [workExperiences, setWorkExperiences] = useState([
        { companyName: "", address: "", position: "", noOfMonth: "", status: "" },
        { companyName: "", address: "", position: "", noOfMonth: "", status: "" },
        { companyName: "", address: "", position: "", noOfMonth: "", status: "" },
    ]);

    const handleChange = (index, field, value) => {
        setWorkExperiences((prev) => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        toast.info("Saving work experiences...");

        // Only send filled-in work experiences
        const validEntries = workExperiences.filter(
            (exp) =>
                exp.companyName.trim() !== "" ||
                exp.address.trim() !== "" ||
                exp.position.trim() !== "" ||
                exp.noOfMonth.trim() !== "" ||
                exp.status.trim() !== ""
        );

        try {
            const responses = await Promise.all(
                validEntries.map((exp) =>
                    UserService.createWorkExperience({
                        userId: userId || 0,
                        ...exp,
                    })
                )
            );

            if (responses.every((res) => res && Object.keys(res).length > 0)) {
                toast.success(
                    "Work experience saved successfully! You may now proceed to Other Skills form."
                );

                if (fromProfile) {
                    router.back();
                } else {
                    setSection("Other Skills")
                }
            } else {
                toast.warning("No valid work experience entries found.");
            }
        } catch (error) {
            toast.error(error.message || "Failed to save work experience.");
        } finally {
            setLoading(false);
        }
    };

    const handleSkipOrBack = () => {
        if (fromProfile) {
            router.back();
        } else {
            toast.info("You can edit this information on your profile once logged in.");
            router.push("/auth/login");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-6 md:p-10 space-y-8"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-primary">Work Experience</h2>
                    <button
                        type="button"
                        onClick={handleSkipOrBack}
                        className="text-sm text-primary hover:underline"
                    >
                        {fromProfile ? "Back" : "Skip for now"}
                    </button>
                </div>

                <p className="text-sm text-gray-600">
                    Limit to 10-year period, start with the most recent employment.
                </p>

                {/* Work Experience Sections */}
                {workExperiences.map((exp, index) => (
                    <section key={index} className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            Work Experience {index + 1}
                        </h3>

                        <div className="space-y-3">
                            <Input
                                placeholder="Company Name"
                                value={exp.companyName}
                                onChange={(e) => handleChange(index, "companyName", e.target.value)}
                                className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                            />
                            <Input
                                placeholder="Address (City/Municipality)"
                                value={exp.address}
                                onChange={(e) => handleChange(index, "address", e.target.value)}
                                className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                            />
                            <Input
                                placeholder="Position"
                                value={exp.position}
                                onChange={(e) => handleChange(index, "position", e.target.value)}
                                className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                            />
                            <Input
                                placeholder="No. of months"
                                value={exp.noOfMonth}
                                onChange={(e) => handleChange(index, "noOfMonth", e.target.value)}
                                className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                            />
                            <div className="space-y-1">
                                <Label>Status</Label>
                                <Input
                                    placeholder="e.g. Permanent, Contractual, etc."
                                    value={exp.status}
                                    onChange={(e) => handleChange(index, "status", e.target.value)}
                                    className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                                />
                            </div>
                        </div>
                    </section>
                ))}

                {/* Submit */}
                <div className="pt-6">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white hover:opacity-90"
                    >
                        {loading ? "Saving..." : "Next"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
