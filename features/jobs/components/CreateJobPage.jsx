"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Rocket } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// BACKEND SERVICES (Flutter-equivalent)
import { JobService } from "@/services/job.service";
// import { NotificationService } from "@/services/notification.service";
import { AuthService } from "@/services/auth.service";
import { useClaims } from "@/hooks/use-claims";

export function CreateJobPage() {

    const router = useRouter();
    const { claims } = useClaims();
    const [employerId, setEmployerId] = useState(null);

    // Equivalent to loadUser() in Flutter
    useEffect(() => {
        async function loadUser() {
            const data = await AuthService.getClaims();
            setEmployerId(data?.id);
        }
        loadUser();
    }, []);

    const [form, setForm] = useState({
        title: "",
        company: "",
        location: "",
        type: "",
        visibility: "",
        salary: "",
        description: "",
        skills: []
    });

    const jobTypes = ["Full-time", "Part-time"];
    const visibilities = ["Lite", "Branded", "Premium"];
    const skillsList = [
        "Auto Mechanic", "Beautician", "Carpentry Work", "Computer Literate",
        "Domestic Chores", "Driver", "Electrician", "Embroidery",
        "Gardening", "Masonry", "Painter/Artist", "Painting Jobs",
        "Photography", "Plumbing", "Sewing Dresses", "Stenography", "Tailoring"
    ];

    function changeField(field, value) {
        setForm({ ...form, [field]: value });
    }

    function addSkill(skill) {
        if (!form.skills.includes(skill)) {
            setForm({ ...form, skills: [...form.skills, skill] });
        }
    }

    function removeSkill(skill) {
        setForm({
            ...form,
            skills: form.skills.filter((s) => s !== skill)
        });
    }

    // SUBMIT = Flutter’s _submitForm()
    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.title || !form.company || !form.location) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            // --- 1. CREATE JOB ---
            const jobRes = await JobService.createJob({
                title: form.title,
                company: form.company,
                location: form.location,
                salary: form.salary,
                type: form.type,
                description: form.description,
                employerId: employerId,
                visibility: form.visibility
            });

            // --- 2. CREATE NOTIFICATION (same as Flutter) ---
            // await NotificationService.createNotification({
            //     userId: 7,
            //     type: "JOB CREATED",
            //     content: `Job ${form.title} has been created.`,
            // });

            // --- 3. CREATE JOB SKILLS (same as Flutter loop) ---
            for (const skill of form.skills) {
                await JobService.createJobSkill({
                    jobId: jobRes.id,
                    skill: skill
                });
            }

            toast.success(`Job ${form.title} created successfully!`);
            router.push("/employer/dashboard");

        } catch (err) {
            toast.error(err.message || "Failed to create job.");
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">

            {/* HEADER */}
            <div className="flex items-center justify-center mb-10">
                <Rocket className="mr-2 h-6 w-6 text-primary" />
                <h1 className="text-2xl font-semibold">Post a New Job</h1>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">

                {/* JOB TITLE */}
                <div>
                    <label className="text-sm font-medium">Job Title</label>
                    <Input
                        className="bg-white"
                        value={form.title}
                        onChange={(e) => changeField("title", e.target.value)}
                    />
                </div>

                {/* COMPANY */}
                <div>
                    <label className="text-sm font-medium">Company</label>
                    <Input
                        className="bg-white"
                        value={form.company}
                        onChange={(e) => changeField("company", e.target.value)}
                    />
                </div>

                {/* LOCATION */}
                <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                        className="bg-white"
                        value={form.location}
                        onChange={(e) => changeField("location", e.target.value)}
                    />
                </div>

                {/* JOB TYPE */}
                <div>
                    <label className="text-sm font-medium">Job Type</label>
                    <Select onValueChange={(v) => changeField("type", v)}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {jobTypes.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* VISIBILITY */}
                <div>
                    <label className="text-sm font-medium">Visibility</label>
                    <Select onValueChange={(v) => changeField("visibility", v)}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Visibility" />
                        </SelectTrigger>
                        <SelectContent>
                            {visibilities.map((v) => (
                                <SelectItem key={v} value={v}>{v}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* SALARY */}
                <div>
                    <label className="text-sm font-medium">Salary</label>
                    <Input
                        className="bg-white"
                        value={form.salary}
                        onChange={(e) => changeField("salary", e.target.value)}
                    />
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className="text-sm font-medium">Job Description</label>
                    <Textarea
                        className="bg-white min-h-[120px]"
                        value={form.description}
                        onChange={(e) => changeField("description", e.target.value)}
                    />
                </div>

                {/* SKILLS */}
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium">Required Skills</label>

                    {/* Selected badges */}
                    <div className="flex flex-wrap gap-2">
                        {form.skills.map((skill) => (
                            <Badge key={skill} className="bg-blue-600 text-white flex items-center gap-1 px-3 py-1">
                                {skill}
                                <X className="h-4 w-4 cursor-pointer" onClick={() => removeSkill(skill)} />
                            </Badge>
                        ))}
                    </div>

                    {/* Add skill */}
                    <Select onValueChange={addSkill}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Skill" />
                        </SelectTrigger>
                        <SelectContent>
                            {skillsList.map((skill) => (
                                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* SUBMIT + CANCEL */}
                <div className="flex gap-4 pt-4">
                    <Button type="submit" className="bg-green-700 hover:bg-green-800 flex gap-2">
                        🚀 Post Job
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
