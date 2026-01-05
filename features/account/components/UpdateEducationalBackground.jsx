"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { UserService } from "@/services/user.service";
import { educationLevels } from "@/lib/utils";

const YES_NO = ["Yes", "No"];

const safeDateOnly = (val) => {
    if (!val) return "";
    return String(val).split("T")[0];
};

export function UpdateEducationalBackground({ open, setOpen, user, userId, setReload }) {
    const [form, setForm] = useState({
        elem_year_grad: user?.elem_year_grad ?? "",
        elem_level_reached: user?.elem_level_reached ?? "",
        elem_year_last_attended: user?.elem_year_last_attended ?? "",

        seco_year_grad: user?.seco_year_grad ?? "",
        seco_level_reached: user?.seco_level_reached ?? "",
        seco_year_last_attended: user?.seco_year_last_attended ?? "",

        ter_course: user?.ter_course ?? "",
        ter_year_grad: user?.ter_year_grad ?? "",
        ter_level_reached: user?.ter_level_reached ?? "",
        ter_year_last_attended: user?.ter_year_last_attended ?? "",

        gs_course: user?.gs_course ?? "",
        gs_year_grad: user?.gs_year_grad ?? "",
        gs_level_reached: user?.gs_level_reached ?? "",
        gs_year_last_attended: user?.gs_year_last_attended ?? "",

        is_kto12: user?.is_kto12 ?? 0, // 0 or 1
        shs_strand: user?.shs_strand ?? "",

        highest_education: user?.highest_education ?? "",
    });

    const [loading, setLoading] = useState(false);

    function updateField(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    const isExisting = useMemo(() => {
        return !!(user && Object.keys(user).length > 0);
        // Better if you have id:
        // return !!user?.id;
    }, [user]);

    // Optional: auto-compute highest_education (simple heuristic)
    const computedHighest = useMemo(() => {
        if (form.gs_course || form.gs_year_grad || form.gs_level_reached) return "Graduate Studies";
        if (form.ter_course || form.ter_year_grad || form.ter_level_reached) return "Tertiary Level";
        if (form.seco_year_grad || form.seco_level_reached) return "Secondary Level";
        if (form.elem_year_grad || form.elem_level_reached) return "Elementary Level";
        return "";
    }, [
        form.elem_year_grad,
        form.elem_level_reached,
        form.seco_year_grad,
        form.seco_level_reached,
        form.ter_course,
        form.ter_year_grad,
        form.ter_level_reached,
        form.gs_course,
        form.gs_year_grad,
        form.gs_level_reached,
    ]);

    async function handleSubmit() {
        try {
            setLoading(true);

            const payload = {
                user_id: userId,

                elem_year_grad: form.elem_year_grad || "",
                elem_level_reached: form.elem_level_reached || "",
                elem_year_last_attended: form.elem_year_last_attended || "",

                seco_year_grad: form.seco_year_grad || "",
                seco_level_reached: form.seco_level_reached || "",
                seco_year_last_attended: form.seco_year_last_attended || "",

                ter_course: form.ter_course || "",
                ter_year_grad: form.ter_year_grad || "",
                ter_level_reached: form.ter_level_reached || "",
                ter_year_last_attended: form.ter_year_last_attended || "",

                gs_course: form.gs_course || "",
                gs_year_grad: form.gs_year_grad || "",
                gs_level_reached: form.gs_level_reached || "",
                gs_year_last_attended: form.gs_year_last_attended || "",

                is_kto12: Number(form.is_kto12) || 0,
                shs_strand: Number(form.is_kto12) === 1 ? (form.shs_strand || "") : "",

                highest_education: form.highest_education || computedHighest || "",
            };

            const createPayload = {
                userId: userId,

                elemYearGrad: form.elem_year_grad || "",
                elemLevelReached: form.elem_level_reached || "",
                elemYearLastAttended: form.elem_year_last_attended || "",

                secoYearGrad: form.seco_year_grad || "",
                secoLevelReached: form.seco_level_reached || "",
                secoYearLastAttended: form.seco_year_last_attended || "",

                terCourse: form.ter_course || "",
                terYearGrad: form.ter_year_grad || "",
                terLevelReached: form.ter_level_reached || "",
                terYearLastAttended: form.ter_year_last_attended || "",

                gsCourse: form.gs_course || "",
                gsYearGrad: form.gs_year_grad || "",
                gsLevelReached: form.gs_level_reached || "",
                gsYearLastAttended: form.gs_year_last_attended || "",

                isKto12: Number(form.is_kto12) || 0,
                shsStrand: Number(form.is_kto12) === 1 ? (form.shs_strand || "") : "",

                highest_education: form.highest_education || computedHighest || "",
            };


            if (!isExisting) {
                await UserService.createEducationalBackground(createPayload); // ✅ rename if needed
                toast.success("Educational Background created successfully!");
                setReload?.((prev) => !prev);
                setOpen(false);
                return;
            }

            await UserService.updateUserEducationalBackground(payload); // ✅ rename if needed
            toast.success("Educational Background updated!");
            setReload?.((prev) => !prev);
            setOpen(false);
        } catch (err) {
            toast.error(err?.message || "Update failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isExisting ? "Edit Educational Background" : "Create Educational Background"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">

                    <FormItem label="Highest Attained Education">
                        <Select
                            value={form.highest_education || ""}
                            onValueChange={(val) => updateField("highest_education", val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {educationLevels.map((x) => (
                                    <SelectItem key={x} value={x}>
                                        {x}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                    {/* ELEMENTARY */}
                    <h3 className="font-semibold text-gray-800 mt-2">Elementary</h3>

                    <FormItem label="Year Graduated">
                        <Input
                            value={form.elem_year_grad}
                            onChange={(e) => updateField("elem_year_grad", e.target.value)}
                            placeholder="e.g. 2016"
                        />
                    </FormItem>

                    <FormItem label="Level Reached">
                        <Input
                            value={form.elem_level_reached}
                            onChange={(e) => updateField("elem_level_reached", e.target.value)}
                            placeholder="e.g. 6"
                        />
                    </FormItem>

                    <FormItem label="Year Last Attended">
                        <Input
                            value={form.elem_year_last_attended}
                            onChange={(e) => updateField("elem_year_last_attended", e.target.value)}
                            placeholder="e.g. 2015"
                        />
                    </FormItem>

                    {/* SECONDARY */}
                    <h3 className="font-semibold text-gray-800 mt-2">Secondary</h3>

                    <FormItem label="Year Graduated">
                        <Input
                            value={form.seco_year_grad}
                            onChange={(e) => updateField("seco_year_grad", e.target.value)}
                            placeholder="e.g. 2020"
                        />
                    </FormItem>

                    <FormItem label="Level Reached">
                        <Input
                            value={form.seco_level_reached}
                            onChange={(e) => updateField("seco_level_reached", e.target.value)}
                            placeholder="e.g. 10"
                        />
                    </FormItem>

                    <FormItem label="Year Last Attended">
                        <Input
                            value={form.seco_year_last_attended}
                            onChange={(e) => updateField("seco_year_last_attended", e.target.value)}
                            placeholder="e.g. 2019"
                        />
                    </FormItem>

                    {/* K-12 */}
                    <h3 className="font-semibold text-gray-800 mt-2">K-12 / Senior High</h3>

                    <FormItem label="Is K-12?">
                        <Select
                            value={Number(form.is_kto12) === 1 ? "Yes" : "No"}
                            onValueChange={(val) => updateField("is_kto12", val === "Yes" ? 1 : 0)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {YES_NO.map((x) => (
                                    <SelectItem key={x} value={x}>
                                        {x}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>

                    {Number(form.is_kto12) === 1 && (
                        <FormItem label="SHS Strand">
                            <Input
                                value={form.shs_strand}
                                onChange={(e) => updateField("shs_strand", e.target.value)}
                                placeholder="e.g. STEM"
                            />
                        </FormItem>
                    )}

                    {/* TERTIARY */}
                    <h3 className="font-semibold text-gray-800 mt-2">Tertiary</h3>

                    <FormItem label="Course">
                        <Input
                            value={form.ter_course}
                            onChange={(e) => updateField("ter_course", e.target.value)}
                            placeholder="e.g. BS Information Technology"
                        />
                    </FormItem>

                    <FormItem label="Year Graduated">
                        <Input
                            value={form.ter_year_grad}
                            onChange={(e) => updateField("ter_year_grad", e.target.value)}
                            placeholder="e.g. 2026"
                        />
                    </FormItem>

                    <FormItem label="Level Reached">
                        <Input
                            value={form.ter_level_reached}
                            onChange={(e) => updateField("ter_level_reached", e.target.value)}
                            placeholder="e.g. 4th Year"
                        />
                    </FormItem>

                    <FormItem label="Year Last Attended">
                        <Input
                            value={form.ter_year_last_attended}
                            onChange={(e) => updateField("ter_year_last_attended", e.target.value)}
                            placeholder="e.g. 2025"
                        />
                    </FormItem>

                    {/* GRADUATE STUDIES */}
                    <h3 className="font-semibold text-gray-800 mt-2">Graduate Studies</h3>

                    <FormItem label="Course">
                        <Input
                            value={form.gs_course}
                            onChange={(e) => updateField("gs_course", e.target.value)}
                            placeholder="e.g. Master in ..."
                        />
                    </FormItem>

                    <FormItem label="Year Graduated">
                        <Input
                            value={form.gs_year_grad}
                            onChange={(e) => updateField("gs_year_grad", e.target.value)}
                            placeholder="e.g. 2028"
                        />
                    </FormItem>

                    <FormItem label="Level Reached">
                        <Input
                            value={form.gs_level_reached}
                            onChange={(e) => updateField("gs_level_reached", e.target.value)}
                            placeholder="e.g. 1st Year"
                        />
                    </FormItem>

                    <FormItem label="Year Last Attended">
                        <Input
                            value={form.gs_year_last_attended}
                            onChange={(e) => updateField("gs_year_last_attended", e.target.value)}
                            placeholder="e.g. 2027"
                        />
                    </FormItem>
                    
                </div>

                <DialogFooter>
                    <Button
                        className="bg-primary text-white"
                        onClick={handleSubmit}
                        disabled={loading}
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
