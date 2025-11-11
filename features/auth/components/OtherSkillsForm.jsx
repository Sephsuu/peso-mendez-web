"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/user.service";

export function OtherSkillsForm({ userId, fromProfile = false, setSection }) {
    const router = useRouter();
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [loading, setLoading] = useState(false);

    const skills = [
        "Auto Mechanic",
        "Beautician",
        "Carpentry Work",
        "Computer Literate",
        "Domestic Chores",
        "Driver",
        "Electrician",
        "Embroidery",
        "Gardening",
        "Masonry",
        "Painter/Artist",
        "Painting Jobs",
        "Photography",
        "Plumbing",
        "Sewing Dresses",
        "Stenography",
        "Tailoring",
    ];

    const handleToggle = (skill) => {
        setSelectedSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : [...prev, skill]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedSkills.length === 0) {
            toast.warning("Please select at least one skill or click skip.");
            return;
        }

        setLoading(true);
        toast.info("Saving selected skills...");

        try {
            const responses = await Promise.all(
                selectedSkills.map((skill) =>
                    UserService.createOtherSkill({
                        userId: userId || 0,
                        skill,
                    })
                )
            );

            if (responses.every((res) => res && Object.keys(res).length > 0)) {
                toast.success("Other skills saved successfully!");
                router.push("/auth/login");
            }
        } catch (error) {
            toast.error(error.message || "Failed to save other skills.");
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        toast.info("You can edit your information on your profile once logged in.");
        router.push("/auth/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-6 md:p-10 space-y-8"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-primary text-center flex-1">
                        Other Skills Without Certificate
                    </h2>
                    <button
                        type="button"
                        onClick={handleSkip}
                        className="text-sm text-primary hover:underline whitespace-nowrap"
                    >
                        Skip for now
                    </button>
                </div>

                <p className="text-sm text-gray-600 text-center">
                    Select skills that are matched to yours.
                </p>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8">
                    {skills.map((skill) => (
                        <div
                            key={skill}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={skill.toLowerCase().replace(/\s+/g, "-")}
                                checked={selectedSkills.includes(skill)}
                                onCheckedChange={() => handleToggle(skill)}
                            />
                            <Label
                                htmlFor={skill.toLowerCase().replace(/\s+/g, "-")}
                                className="text-sm"
                            >
                                {skill}
                            </Label>
                        </div>
                    ))}
                </div>

                {/* Submit */}
                <div className="pt-6">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white hover:opacity-90"
                    >
                        {loading ? "Saving..." : "Finish"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
