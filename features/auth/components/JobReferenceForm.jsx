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

export function JobReferenceForm({ userId, fromProfile = false, setSection }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        occupationType: "",
        occupation1: "",
        occupation2: "",
        occupation3: "",
        locationType: "",
        location1: "",
        location2: "",
        location3: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = [
            "occupationType",
            "occupation1",
            "occupation2",
            "occupation3",
            "locationType",
            "location1",
            "location2",
            "location3",
        ];

        const missingField = requiredFields.find(
            (field) =>
                !formData[field] || formData[field].toString().trim() === ""
        );

        if (missingField) {
            toast.error("Please fill in all required fields.");
            return;
        }

        toast.info("Saving job reference...");
        setLoading(true);

        try {
            await UserService.createJobReference({
                userId: userId || 0,
                ...formData,
            });

            toast.success("Job Reference saved successfully!");

            if (fromProfile) {
                router.back();
            } else {
                setSection("Language Profeciency");
            }
        } catch (error) {
            toast.error(error.message || "Failed to save job reference.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-6 md:p-10 space-y-6"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-primary">Job Reference</h2>
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

                {/* Occupation Type */}
                <SelectGroup
                    label="Occupation Type"
                    value={formData.occupationType}
                    onValueChange={(val) => handleChange("occupationType", val)}
                    items={["Part-time", "Full-time"]}
                    required
                />

                {/* Preferred Occupations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup
                        label="Preferred Occupation 1"
                        value={formData.occupation1}
                        onChange={(e) => handleChange("occupation1", e.target.value)}
                        required
                    />
                    <InputGroup
                        label="Preferred Occupation 2"
                        value={formData.occupation2}
                        onChange={(e) => handleChange("occupation2", e.target.value)}
                        required
                    />
                    <InputGroup
                        label="Preferred Occupation 3"
                        value={formData.occupation3}
                        onChange={(e) => handleChange("occupation3", e.target.value)}
                        required
                    />
                </div>

                {/* Location Type */}
                <SelectGroup
                    label="Location Type"
                    value={formData.locationType}
                    onValueChange={(val) => handleChange("locationType", val)}
                    items={["Local", "Overseas"]}
                    required
                />

                {/* Preferred Locations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Location 1 */}
                    {formData.locationType === "Local" ? (
                        <SelectGroup
                            label="Preferred Work Location 1"
                            value={formData.location1}
                            onValueChange={(val) => handleChange("location1", val)}
                            items={caviteLocations}
                            required
                        />
                    ) : (
                        <InputGroup
                            label="Preferred Work Location 1"
                            value={formData.location1}
                            onChange={(e) => handleChange("location1", e.target.value)}
                            required
                        />
                    )}

                    {/* Location 2 */}
                    {formData.locationType === "Local" ? (
                        <SelectGroup
                            label="Preferred Work Location 2"
                            value={formData.location2}
                            onValueChange={(val) => handleChange("location2", val)}
                            items={caviteLocations}
                        />
                    ) : (
                        <InputGroup
                            label="Preferred Work Location 2"
                            value={formData.location2}
                            onChange={(e) => handleChange("location2", e.target.value)}
                        />
                    )}

                    {/* Location 3 */}
                    {formData.locationType === "Local" ? (
                        <SelectGroup
                            label="Preferred Work Location 3"
                            value={formData.location3}
                            onValueChange={(val) => handleChange("location3", val)}
                            items={caviteLocations}
                            required
                        />
                    ) : (
                        <InputGroup
                            label="Preferred Work Location 3"
                            value={formData.location3}
                            onChange={(e) => handleChange("location3", e.target.value)}
                            required
                        />
                    )}
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

function SelectGroup({ label, value, onValueChange, items, required }) {
    return (
        <div className="space-y-1">
            <Label>
                {label} {required && <span className="text-red-500">*</span>}
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
