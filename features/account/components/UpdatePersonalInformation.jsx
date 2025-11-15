"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { UserService } from "@/services/user.service";

export function UpdatePersonalInformation({ open, setOpen, user, userId }) {
    const [form, setForm] = useState({ ...user });
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
                middleName: form.middle_name,
                suffix: form.suffix,
                dateOfBirth: form.date_of_birth,
                religion: form.religion,
                presentAddress: form.present_address,
                tin: form.tin,
                sex: form.sex,
                civilStatus: form.civil_status,
                disability: form.disability,
                employmentStatus: form.employment_status,
                employmentType: form.employment_type,
                isOfw: form.is_ofw,
                isFormerOfw: form.is_former_ofw,
            };

            if (!user || Object.keys(user).length === 0) {
                const data = await UserService.createPersonalInformation(payload);
                if (data) {
                    toast.success("Personal Information created successfully!")
                    setOpen(false)
                    return;
                }
            }

            const res = await UserService.updateUserPersonalInformation(payload);

            toast.success("Personal information updated!");
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
                    <FormItem label="Gender">
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
                                        <SelectItem value="Wage employed">Wage employed</SelectItem>
                                        <SelectItem value="Self-employed">Self-employed</SelectItem>
                                    </>
                                ) : (
                                    <>
                                        <SelectItem value="New/Fresh Graduate">New/Fresh Graduate</SelectItem>
                                        <SelectItem value="Finished Contract">Finished Contract</SelectItem>
                                        <SelectItem value="Resigned">Resigned</SelectItem>
                                        <SelectItem value="Retired">Retired</SelectItem>
                                        <SelectItem value="Laid off due to calamity">Laid off due to calamity</SelectItem>
                                        <SelectItem value="Terminated">Terminated</SelectItem>
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
