"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { UserService } from "@/services/user.service";
import { caviteLocations } from "@/lib/utils";

const DISABILITY_OPTIONS = [
    "N/A",
    "Visual",
    "Hearing",
    "Speech",
    "Physical",
    "Mental",
    "Other",
];

const EMPLOYMENT_STATUS_OPTIONS = ["Employed", "Unemployed"];

const EMPLOYED_TYPES = ["Wage employed", "Self-employed"];

const UNEMPLOYED_TYPES = [
    "New/Fresh Graduate",
    "Finished Contract",
    "Resigned",
    "Retired",
    "Laid off due to calamity",
    "Terminated",
];


export function UpdatePersonalInformation({ open, setOpen, user, userId, setReload }) {
    const [form, setForm] = useState({
        first_name: user?.first_name ?? "",
        middle_name: user?.middle_name ?? "",
        surname: user?.surname ?? "",
        suffix: user?.suffix ?? "",
        date_of_birth: user?.date_of_birth ?? "",
        sex: user?.sex ?? "",
        religion: user?.religion ?? "",
        present_address: user?.present_address ?? "",
        tin: user?.tin ?? "",
        civil_status: user?.civil_status ?? "",
        disability: user?.disability ?? "",
        employment_status: user?.employment_status ?? "",
        employment_type: user?.employment_type ?? "",
        is_ofw: user?.is_ofw ?? "",
        is_former_ofw: user?.is_former_ofw ?? "",
        citmun: user?.citmun ?? "",
    });

    const [loading, setLoading] = useState(false);

    function updateField(key, value) {
        setForm(prev => ({ ...prev, [key]: value }));
    }

    async function handleSubmit() {
        try {
            setLoading(true);

            const payload = {
                userId: userId,

                surname: form.surname,
                firstName: form.first_name,
                dateOfBirth: form.date_of_birth,
                presentAddress: form.present_address,
                sex: form.sex,
                civilStatus: form.civil_status,
                employmentStatus: form.employment_status,
                disability: form.disability,
                employmentStatus: form.employment_status,
                employmentType: form.employment_type,
                isOfw: form.is_ofw,
                isFormerOfw: form.is_former_ofw,
                citmun: form.citmun,
            };

            if (form.middle_name) payload.middleName = form.middle_name;
            if (form.suffix) payload.suffix = form.suffix;
            if (form.religion) payload.religion = form.religion;
            if (form.tin) payload.tin = form.tin;

            if (!user || Object.keys(user).length === 0) {
                await UserService.createPersonalInformation(payload);
                toast.success("Personal Information created successfully!");
                setOpen(false);
                return;
            }

            await UserService.updateUserPersonalInformation(payload);

            toast.success("Personal information updated!");
            setReload(prev => !prev);
            setOpen(false);
        } catch (err) {
            toast.error(err.message || "Update failed.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Personal Information</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">

                    {/* NAME FIELDS */}
                    <FormItem label="First Name">
                        <Input value={form.first_name} onChange={(e) => updateField("first_name", e.target.value)} />
                    </FormItem>

                    <FormItem label="Middle Name">
                        <Input value={form.middle_name} onChange={(e) => updateField("middle_name", e.target.value)} />
                    </FormItem>

                    <FormItem label="Surname">
                        <Input value={form.surname} onChange={(e) => updateField("surname", e.target.value)} />
                    </FormItem>

                    <FormItem label="Suffix">
                        <Input value={form.suffix} onChange={(e) => updateField("suffix", e.target.value)} />
                    </FormItem>

                    {/* DATE OF BIRTH */}
                    <FormItem label="Date of Birth">
                        <Input type="date" value={form.date_of_birth?.split("T")[0] ?? ""} onChange={(e) => updateField("date_of_birth", e.target.value)} />
                    </FormItem>

                    {/* GENDER */}
                    <FormItem label="Sex">
                        <Select value={form.sex} onValueChange={(val) => updateField("sex", val)}>
                            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>

                    {/* RELIGION */}
                    <FormItem label="Religion">
                        <Input value={form.religion} onChange={(e) => updateField("religion", e.target.value)} />
                    </FormItem>

                    <FormItem label="City/Municipality">
                        <Select value={form.citmun} onValueChange={(val) => updateField("citmun", val)}>
                            <SelectTrigger><SelectValue placeholder="Select city/municipality" /></SelectTrigger>
                            <SelectContent>
                                {caviteLocations.map((item) => (
                                    <SelectItem key={item} value={item}>{item}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>

                    {/* PRESENT ADDRESS */}
                    <FormItem label="Present Address">
                        <Input value={form.present_address} onChange={(e) => updateField("present_address", e.target.value)} />
                    </FormItem>

                    {/* TIN */}
                    <FormItem label="TIN">
                        <Input value={form.tin} onChange={(e) => updateField("tin", e.target.value)} />
                    </FormItem>

                    {/* CIVIL STATUS */}
                    <FormItem label="Civil Status">
                        <Select value={form.civil_status} onValueChange={(val) => updateField("civil_status", val)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Single">Single</SelectItem>
                                <SelectItem value="Married">Married</SelectItem>
                                <SelectItem value="Widowed">Widowed</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>

                    {/* DISABILITY */}
                    <FormItem label="Disability">
                        <Select value={form.disability} onValueChange={(val) => updateField("disability", val)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="N/A">N/A</SelectItem>
                                <SelectItem value="Visual">Visual</SelectItem>
                                <SelectItem value="Hearing">Hearing</SelectItem>
                                <SelectItem value="Speech">Speech</SelectItem>
                                <SelectItem value="Physical">Physical</SelectItem>
                                <SelectItem value="Mental">Mental</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>

                    {/* EMPLOYMENT STATUS */}
                    <FormItem label="Employment Status">
                        <Select value={form.employment_status} onValueChange={(val) => updateField("employment_status", val)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Employed">Employed</SelectItem>
                                <SelectItem value="Unemployed">Unemployed</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>

                    {/* EMPLOYMENT TYPE */}
                    <FormItem label="Employment Type">
                        <Select value={form.employment_type} onValueChange={(val) => updateField("employment_type", val)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {form.employment_status === "Employed" ? (
                                    <>
                                        {EMPLOYED_TYPES.map((item) => (
                                            <SelectItem key={item} value={item}>{item}</SelectItem>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {UNEMPLOYED_TYPES.map((item) => (
                                            <SelectItem key={item} value={item}>{item}</SelectItem>
                                        ))}
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </FormItem>

                    {/* OFW */}
                    <FormItem label="Are you an OFW?">
                        <Select value={form.is_ofw} onValueChange={(val) => updateField("is_ofw", val)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>

                    <FormItem label="Former OFW?">
                        <Select value={form.is_former_ofw} onValueChange={(val) => updateField("is_former_ofw", val)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                        </Select>
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
