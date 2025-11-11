"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/user.service";

export function TechVocTrainingForm({ userId, fromProfile = false, setSection }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // State for each training entry
    const [trainings, setTrainings] = useState([
        { course: "", hoursTraining: "", institution: "", skillsAcquired: "", certReceived: "" },
        { course: "", hoursTraining: "", institution: "", skillsAcquired: "", certReceived: "" },
        { course: "", hoursTraining: "", institution: "", skillsAcquired: "", certReceived: "" },
    ]);

    const handleChange = (index, field, value) => {
        setTrainings((prev) => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        toast.info("Saving Technical/Vocational Trainings...");

        try {
            const responses = await Promise.all(
                trainings.map((training) =>
                    UserService.createTechVocTraining({
                        userId: userId || 0,
                        ...training,
                    })
                )
            );

            if (responses.every((res) => res && Object.keys(res).length > 0)) {
                toast.success("Technical/Vocational trainings saved successfully!");

                if (fromProfile) {
                    router.back();
                } else {
                    setSection("Eligibility")
                }
            }
        } catch (error) {
            toast.error(error.message || "Failed to save trainings.");
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
                    <h2 className="text-2xl font-semibold text-primary">
                        Technical/Vocational and Other Trainings
                    </h2>
                    <button
                        type="button"
                        onClick={handleSkipOrBack}
                        className="text-sm text-primary hover:underline"
                    >
                        {fromProfile ? "Back" : "Skip for now"}
                    </button>
                </div>

                {/* Trainings Section */}
                {trainings.map((training, index) => (
                    <section key={index} className="space-y-4">
                        <h3 className="text-lg font-semibold">Training {index + 1}</h3>

                        <div className="space-y-3">
                            <Input
                                placeholder="Technical/Vocational Course"
                                value={training.course}
                                onChange={(e) => handleChange(index, "course", e.target.value)}
                                className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                            />
                            <Input
                                placeholder="Hrs. of Training"
                                value={training.hoursTraining}
                                onChange={(e) => handleChange(index, "hoursTraining", e.target.value)}
                                className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                            />
                            <Input
                                placeholder="Training Institution"
                                value={training.institution}
                                onChange={(e) => handleChange(index, "institution", e.target.value)}
                                className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                            />
                            <Input
                                placeholder="Skills Acquired"
                                value={training.skillsAcquired}
                                onChange={(e) => handleChange(index, "skillsAcquired", e.target.value)}
                                className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                            />
                            <div className="space-y-1">
                                <Label>Certificate Received</Label>
                                <Input
                                    placeholder="e.g. NC I, NC II, NC III, etc."
                                    value={training.certReceived}
                                    onChange={(e) => handleChange(index, "certReceived", e.target.value)}
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
