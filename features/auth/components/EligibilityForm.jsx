"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/user.service";

export function EligibilityForm({ userId, fromProfile = false, setSection }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        eligible1: "",
        dateTaken1: "",
        eligible2: "",
        dateTaken2: "",
        prc1: "",
        validUntil1: "",
        prc2: "",
        validUntil2: "",
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        toast.info("Saving Eligibility/Professional License...");

        const eligibility1 = {
            userId: userId || 0,
            eligibility: formData.eligible1,
            dateTaken: formData.dateTaken1,
        };
        const eligibility2 = {
            userId: userId || 0,
            eligibility: formData.eligible2,
            dateTaken: formData.dateTaken2,
        };
        const license1 = {
            userId: userId || 0,
            license: formData.prc1,
            validUntil: formData.validUntil1,
        };
        const license2 = {
            userId: userId || 0,
            license: formData.prc2,
            validUntil: formData.validUntil2,
        };
        
        try {
            const [res1, res2, prc1Res, prc2Res] = await Promise.all([
                UserService.createEligibility(eligibility1),
                UserService.createEligibility(eligibility2),
                UserService.createProfessionalLicense(license1),
                UserService.createProfessionalLicense(license2),
            ]);

            if (res1 && res2 && prc1Res && prc2Res) {
                toast.success(
                    "Eligibility/Professional License saved successfully!"
                );

                if (fromProfile) {
                    router.back();
                } else {
                    setSection("Work Experience")
                }
            }
        } catch (error) {
            toast.error(error.message || "Failed to save data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSkipOrBack = () => {
        if (fromProfile) {
            router.back();
        } else {
            toast.info("You can edit this information on your profile when logged in.");
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
                        Eligibility / Professional License
                    </h2>
                    <button
                        type="button"
                        onClick={handleSkipOrBack}
                        className="text-sm text-primary hover:underline"
                    >
                        {fromProfile ? "Back" : "Skip for now"}
                    </button>
                </div>

                {/* Eligibility Section */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold">Eligibility</h3>

                    {/* Eligibility 1 */}
                    <div className="space-y-2">
                        <Label>Eligibility 1 (if any)</Label>
                        <Input
                            placeholder="(Civil Service)"
                            value={formData.eligible1}
                            onChange={(e) => handleChange("eligible1", e.target.value)}
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                        />
                        <Input
                            placeholder="Date Taken (YYYY-MM-DD)"
                            value={formData.dateTaken1}
                            onChange={(e) => handleChange("dateTaken1", e.target.value)}
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                        />
                    </div>

                    {/* Eligibility 2 */}
                    <div className="space-y-2">
                        <Label>Eligibility 2 (if any)</Label>
                        <Input
                            placeholder="(Civil Service)"
                            value={formData.eligible2}
                            onChange={(e) => handleChange("eligible2", e.target.value)}
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                        />
                        <Input
                            placeholder="Date Taken (YYYY-MM-DD)"
                            value={formData.dateTaken2}
                            onChange={(e) => handleChange("dateTaken2", e.target.value)}
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                        />
                    </div>
                </section>

                {/* PRC Section */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold">
                        Professional License (PRC)
                    </h3>

                    {/* PRC 1 */}
                    <div className="space-y-2">
                        <Label>PRC License 1 (if any)</Label>
                        <Input
                            placeholder="PRC License Name"
                            value={formData.prc1}
                            onChange={(e) => handleChange("prc1", e.target.value)}
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                        />
                        <Input
                            placeholder="Valid Until (YYYY-MM-DD)"
                            value={formData.validUntil1}
                            onChange={(e) => handleChange("validUntil1", e.target.value)}
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                        />
                    </div>

                    {/* PRC 2 */}
                    <div className="space-y-2">
                        <Label>PRC License 2 (if any)</Label>
                        <Input
                            placeholder="PRC License Name"
                            value={formData.prc2}
                            onChange={(e) => handleChange("prc2", e.target.value)}
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                        />
                        <Input
                            placeholder="Valid Until (YYYY-MM-DD)"
                            value={formData.validUntil2}
                            onChange={(e) => handleChange("validUntil2", e.target.value)}
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary"
                        />
                    </div>
                </section>

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
