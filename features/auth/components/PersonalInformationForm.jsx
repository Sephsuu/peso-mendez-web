"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/user.service";
import { caviteLocations } from "@/lib/utils";

const OPTIONAL_FIELDS = [
    "middleName",
    "suffix",
    "tin",
    "religion",
];

export function PersonalInformationForm({ userId, fromProfile = false, setSection }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        surname: "",
        firstName: "",
        middleName: "",
        suffix: "",
        religion: "",
        presentAddress: "",
        tin: "",
        sex: "",
        civilStatus: "",
        disability: "",
        employmentStatus: "",
        employmentType: "",
        isOfw: "",
        isFormerOfw: "",
        dateOfBirth: "",
        citmun: "Mendez"
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const missingField = Object.entries(formData).find(
            ([key, value]) =>
                !OPTIONAL_FIELDS.includes(key) &&
                (!value || value.toString().trim() === "")
        );

        if (missingField) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (missingField) {
            toast.error("Please fill in all required fields.");
            return;
        }

        toast.info("Saving personal information...");
        setLoading(true);

        try {
            await UserService.createPersonalInformation({
                userId: userId || 0,
                ...formData,
            });

            toast.success("Personal Information saved successfully!");

            if (fromProfile) {
                router.back();
            } else {
                setSection("Job Reference")
            }
        } catch (error) {
            toast.error(error.message || "Failed to save personal information.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-6 md:p-10 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-primary">Personal Information</h2>
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

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="Surname" value={formData.surname} onChange={(e) => handleChange("surname", e.target.value)} required />
                    <InputGroup label="First Name" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} required />
                    <InputGroup label="Middle Name" value={formData.middleName} onChange={(e) => handleChange("middleName", e.target.value)} />
                    <InputGroup label="Suffix" value={formData.suffix} onChange={(e) => handleChange("suffix", e.target.value)} />
                </div>

                {/* Address */}
                <SelectGroup
                    label="City/Municipality"
                    value={formData.citmun}
                    onValueChange={(val) => handleChange("citmun", val)}
                    items={caviteLocations}
                />
                <InputGroup
                    label="Present Address"
                    placeholder="House No./Barangay/Municipality/Province"
                    value={formData.presentAddress}
                    onChange={(e) => handleChange("presentAddress", e.target.value)}
                    required
                />

                {/* Date, Sex, Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup
                        label="Date of Birth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                        required
                    />

                    <SelectGroup
                        label="Sex"
                        value={formData.sex}
                        onValueChange={(val) => handleChange("sex", val)}
                        items={["Male", "Female", "Other"]}
                    />

                    <SelectGroup
                        label="Civil Status"
                        value={formData.civilStatus}
                        onValueChange={(val) => handleChange("civilStatus", val)}
                        items={["Single", "Married", "Widowed"]}
                    />
                </div>

                {/* Religion & TIN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="Religion" value={formData.religion} onChange={(e) => handleChange("religion", e.target.value)} />
                    <InputGroup label="TIN Number" value={formData.tin} onChange={(e) => handleChange("tin", e.target.value)} />
                </div>

                {/* Disability, Employment */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectGroup
                        label="Disability"
                        value={formData.disability}
                        onValueChange={(val) => handleChange("disability", val)}
                        items={["None", "Visual", "Hearing", "Speech", "Physical", "Mental", "Others"]}
                        required
                    />

                    <SelectGroup
                        label="Employment Status"
                        value={formData.employmentStatus}
                        onValueChange={(val) => handleChange("employmentStatus", val)}
                        items={["Employed", "Unemployed"]}
                    />

                    <SelectGroup
                        label="Employment Type"
                        value={formData.employmentType}
                        onValueChange={(val) => handleChange("employmentType", val)}
                        items={
                            formData.employmentStatus === "Employed"
                                ? ["Wage Employed", "Self Employed"]
                                : [
                                      "New Graduate",
                                      "Finished Contract",
                                      "Resigned",
                                      "Retired",
                                      "Laid Off Due to Calamity",
                                      "Terminated",
                                  ]
                        }
                    />
                </div>

                {/* OFW Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectGroup
                        label="Are you an OFW?"
                        value={formData.isOfw}
                        onValueChange={(val) => handleChange("isOfw", val)}
                        items={["Yes", "No"]}
                    />
                    <SelectGroup
                        label="Are you a former OFW?"
                        value={formData.isFormerOfw}
                        onValueChange={(val) => handleChange("isFormerOfw", val)}
                        items={["Yes", "No"]}
                    />
                </div>

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

function InputGroup({ label, value, onChange, placeholder, type = "text", required }) {
    return (
        <div className="space-y-1">
            <Label>
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
                type={type}
                placeholder={placeholder || label}
                value={value}
                onChange={onChange}
                required={required}
                className="bg-blue-50 border-primary/30 focus-visible:ring-primary w-full"
            />
        </div>
    );
}

function SelectGroup({ label, value, onValueChange, items }) {
    return (
        <div className="space-y-1">
            <Label>{label} <span className="text-red-500">*</span></Label>
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
