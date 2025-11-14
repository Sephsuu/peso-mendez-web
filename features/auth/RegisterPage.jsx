"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import { PersonalInformationForm } from "@/features/auth/components/PersonalInformationForm";
import { JobReferenceForm } from "@/features/auth/components/JobReferenceForm";
import { LanguageProficiencyForm } from "@/features/auth/components/LanguageProfeciencyForm";
import { EducationalBackgroundForm } from "@/features/auth/components/EducationalBackgroundForm";
import { TechVocTrainingForm } from "@/features/auth/components/TechVocTrainingsForm";
import { EligibilityForm } from "@/features/auth/components/EligibilityForm";
import { WorkExperienceForm } from "@/features/auth/components/WorkExperienceForm";
import { OtherSkillsForm } from "@/features/auth/components/OtherSkillsForm";

const sections = [
    "Register",
    "Personal Information",
    "Job Reference",
    "Language Profeciency",
    "Educational Background",
    "TechVoc Trainings",
    "Eligibility",
    "Work Experience",
    "Other Skills",
];

export function RegisterPage({ fromProfile = false, toEdit }) {
    const [section, setSection] = useState(sections[0]);
    const [userId, setUserId] = useState(0)
    const router = useRouter();

    // Controlled form fields
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);

    // Conditional page render
    if (section === sections[1]) return <PersonalInformationForm userId={ userId } setSection={ setSection } />;
    if (section === sections[2]) return <JobReferenceForm userId={ userId } setSection={ setSection } />;
    if (section === sections[3]) return <LanguageProficiencyForm userId={ userId } setSection={ setSection } />;
    if (section === sections[4]) return <EducationalBackgroundForm userId={ userId } setSection={ setSection } />;
    if (section === sections[5]) return <TechVocTrainingForm userId={ userId } setSection={ setSection } />;
    if (section === sections[6]) return <EligibilityForm userId={ userId } setSection={ setSection } />;
    if (section === sections[7]) return <WorkExperienceForm userId={ userId } setSection={ setSection } />;
    if (section === sections[8]) return <OtherSkillsForm userId={ userId } setSection={ setSection } />;

    // Submit logic
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fullName || !email || !contact || !username || !password || !role) {
            toast.error("Please fill out all required fields.");
            return;
        }

        toast.info("Please wait. We are registering your credentials...");
        setLoading(true);

        try {
            const res = await AuthService.register({
                fullName,
                email,
                contactNumber: contact,
                username,
                password,
                role,
            });

            // Trigger backend notification
            // await NotificationService.createNotification({
            //     userId: 7, // TODO: Replace with dynamic userId if needed
            //     type: "ACCOUNT CREATED",
            //     content: `${res.role === "job_seeker" ? "Job Seeker" : "Employer"} ${res.username} has been registered.`,
            // });

            if (res) {
                toast.success("Successfully registered!");
                console.log(res);
                setUserId(res.userId);
                if (role === "employer") {
                    toast.info("Please login with your credentials.");
                    router.push("/auth/login");
                } else {
                    toast.info("Please fill out your personal information.");
                    setSection("Personal Information");
                }
            }
        } catch (err) {
            toast.error(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8 border border-gray-100">
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-center text-primary">
                    {fromProfile ? "Edit Credentials" : "Create Your Account"}
                </h1>
                <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
                    {!fromProfile && "Job seekers and employers can register here."}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                        <Label htmlFor="fullname" className="text-gray-600">
                            Full Name
                        </Label>
                        <Input
                            id="fullname"
                            type="text"
                            value={(toEdit && toEdit.fullName) ?? fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary w-full"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <Label htmlFor="email" className="text-gray-600">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary w-full"
                        />
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-1">
                        <Label htmlFor="contact" className="text-gray-600">
                            Contact Number
                        </Label>
                        <Input
                            id="contact"
                            type="text"
                            placeholder="e.g., 09123456789"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary w-full"
                        />
                    </div>

                    {/* Username */}
                    <div className="space-y-1">
                        <Label htmlFor="username" className="text-gray-600">
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary w-full"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <Label htmlFor="password" className="text-gray-600">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-blue-50 border-primary/30 focus-visible:ring-primary w-full"
                        />
                    </div>

                    {/* Role Selector */}
                    <div className="space-y-1">
                        <Label className="text-gray-600">I am a:</Label>
                        <Select onValueChange={(val) => setRole(val)}>
                            <SelectTrigger className="bg-blue-50 border-primary/30 focus-visible:ring-primary w-full">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="job_seeker">Job Seeker</SelectItem>
                                <SelectItem value="employer">Employer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/80 text-white h-11 text-md mt-2"
                    >
                        {loading ? "Registering..." : "Register"}
                    </Button>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-600 mt-6 text-sm sm:text-base">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary font-medium hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
