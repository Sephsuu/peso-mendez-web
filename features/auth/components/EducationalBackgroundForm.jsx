"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/user.service";
import { educationLevels } from "@/lib/utils";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";

export function EducationalBackgroundForm({ userId, fromProfile = false, setSection }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        highest_education: "",

        elemYearGrad: "",
        elemLevelReached: "",
        elemYearLastAttended: "",

        secoYearGrad: "",
        secoLevelReached: "",
        secoYearLastAttended: "",

        terCourse: "",
        terYearGrad: "",
        terLevelReached: "",
        terYearLastAttended: "",

        gsCourse: "",
        gsYearGrad: "",
        gsLevelReached: "",
        gsYearLastAttended: "",

        shsStrand: "",
    });

    const [isKto12, setIsKto12] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        toast.info("Saving educational background...");
        setLoading(true);

        const payload = {
            userId: userId || 0,
            ...formData,
            isKto12,
        };

        try {
            await UserService.createEducationalBackground(payload);
            toast.success("Educational background saved successfully!");

            if (fromProfile) {
                router.back();
            } else {
                setSection("TechVoc Trainings")
            }
        } catch (error) {
            toast.error(error.message || "Failed to save educational background.");
        } finally {
            setLoading(false);
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
                    <h2 className="text-2xl font-semibold text-primary">Educational Background</h2>
                    <button
                        type="button"
                        onClick={() => {
                            toast.info("You can edit your information on your profile when logged in.");
                            if (fromProfile) router.back();
                            else router.push("/auth/login");
                        }}
                        className="text-sm text-primary hover:underline"
                    >
                        {fromProfile ? "Back" : "Skip for now"}
                    </button>
                </div>

                <Section title="Highest Education">
                        <SelectGroup
                            value={formData.highest_education}
                            onValueChange={(val) => handleChange("highest_education", val)}
                            items={educationLevels}
                            required
                        />
                </Section>

                {/* Elementary */}
                <Section title="Elementary">
                    <InputRow
                        fields={[
                            {
                                label: "Year Graduated",
                                value: formData.elemYearGrad,
                                onChange: (e) => handleChange("elemYearGrad", e.target.value),
                            },
                        ]}
                    />
                    <div className="space-y-2 mt-3">
                        <Label>If undergraduate:</Label>
                        <InputRow
                            fields={[
                                {
                                    label: "Level Reached",
                                    value: formData.elemLevelReached,
                                    onChange: (e) => handleChange("elemLevelReached", e.target.value),
                                },
                                {
                                    label: "Year Last Attended",
                                    value: formData.elemYearLastAttended,
                                    onChange: (e) => handleChange("elemYearLastAttended", e.target.value),
                                },
                            ]}
                        />
                    </div>
                </Section>

                {/* Secondary */}
                <Section title="Secondary">
                    <RadioGroup
                        value={isKto12 ? "k12" : "non-k12"}
                        onValueChange={(val) => setIsKto12(val === "k12")}
                        className="flex space-x-6 mb-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="k12" id="k12" />
                            <Label htmlFor="k12">K-12</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="non-k12" id="non-k12" />
                            <Label htmlFor="non-k12">Non-K12</Label>
                        </div>
                    </RadioGroup>

                    {isKto12 && (
                        <div className="space-y-2">
                            <Label>If K-12</Label>
                            <Input
                                placeholder="Senior High Strand"
                                value={formData.shsStrand}
                                onChange={(e) => handleChange("shsStrand", e.target.value)}
                            />
                        </div>
                    )}

                    <InputRow
                        fields={[
                            {
                                label: "Year Graduated",
                                value: formData.secoYearGrad,
                                onChange: (e) => handleChange("secoYearGrad", e.target.value),
                            },
                        ]}
                    />
                    <div className="space-y-2 mt-3">
                        <Label>If undergraduate:</Label>
                        <InputRow
                            fields={[
                                {
                                    label: "Level Reached",
                                    value: formData.secoLevelReached,
                                    onChange: (e) => handleChange("secoLevelReached", e.target.value),
                                },
                                {
                                    label: "Year Last Attended",
                                    value: formData.secoYearLastAttended,
                                    onChange: (e) => handleChange("secoYearLastAttended", e.target.value),
                                },
                            ]}
                        />
                    </div>
                </Section>

                {/* Tertiary */}
                <Section title="Tertiary">
                    <InputRow
                        fields={[
                            {
                                label: "Course",
                                value: formData.terCourse,
                                onChange: (e) => handleChange("terCourse", e.target.value),
                            },
                            {
                                label: "Year Graduated",
                                value: formData.terYearGrad,
                                onChange: (e) => handleChange("terYearGrad", e.target.value),
                            },
                        ]}
                    />
                    <div className="space-y-2 mt-3">
                        <Label>If undergraduate:</Label>
                        <InputRow
                            fields={[
                                {
                                    label: "Level Reached",
                                    value: formData.terLevelReached,
                                    onChange: (e) => handleChange("terLevelReached", e.target.value),
                                },
                                {
                                    label: "Year Last Attended",
                                    value: formData.terYearLastAttended,
                                    onChange: (e) => handleChange("terYearLastAttended", e.target.value),
                                },
                            ]}
                        />
                    </div>
                </Section>

                {/* Graduate / Post Graduate */}
                <Section title="Graduate / Post Graduate">
                    <InputRow
                        fields={[
                            {
                                label: "Course",
                                value: formData.gsCourse,
                                onChange: (e) => handleChange("gsCourse", e.target.value),
                            },
                            {
                                label: "Year Graduated",
                                value: formData.gsYearGrad,
                                onChange: (e) => handleChange("gsYearGrad", e.target.value),
                            },
                        ]}
                    />
                    <div className="space-y-2 mt-3">
                        <Label>If undergraduate:</Label>
                        <InputRow
                            fields={[
                                {
                                    label: "Level Reached",
                                    value: formData.gsLevelReached,
                                    onChange: (e) => handleChange("gsLevelReached", e.target.value),
                                },
                                {
                                    label: "Year Last Attended",
                                    value: formData.gsYearLastAttended,
                                    onChange: (e) => handleChange("gsYearLastAttended", e.target.value),
                                },
                            ]}
                        />
                    </div>
                </Section>

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

/* ========== Reusable Components ========== */
function Section({ title, children }) {
    return (
        <section className="space-y-4">
            <h3 className="text-lg font-semibold">{title} {title === "Highest Education" && <span className="text-red-500">*</span>}</h3>
            {children}
        </section>
    );
}

function InputRow({ fields }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f, i) => (
                <Input
                    key={i}
                    placeholder={f.label}
                    value={f.value}
                    onChange={f.onChange}
                    className="bg-blue-50 border-primary/30 focus-visible:ring-primary w-full"
                />
            ))}
        </div>
    );
}

function SelectGroup({ label, value, onValueChange, items, required }) {
    return (
        <div className="space-y-1">
            <Label>
                {label}
            </Label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="bg-blue-50 border-primary/30 focus-visible:ring-primary w-full">
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
