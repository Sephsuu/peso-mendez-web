"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/user.service";

export function LanguageProficiencyForm({ userId, fromProfile = false, setSection }) {
    const router = useRouter();

    const [english, setEnglish] = useState({
        Read: false,
        Write: false,
        Speak: false,
        Understand: false,
    });

    const [filipino, setFilipino] = useState({
        Read: false,
        Write: false,
        Speak: false,
        Understand: false,
    });

    const [mandarin, setMandarin] = useState({
        Read: false,
        Write: false,
        Speak: false,
        Understand: false,
    });

    const [loading, setLoading] = useState(false);

    const toggleCheckbox = (langSetter, langState, field) => {
        langSetter({ ...langState, [field]: !langState[field] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        toast.info("Saving language proficiency...");

        const englishProf = {
            userId: userId || 0,
            language: "English",
            read: english.Read,
            write: english.Write,
            speak: english.Speak,
            understand: english.Understand,
        };

        const filipinoProf = {
            userId: userId || 0,
            language: "Filipino",
            read: filipino.Read,
            write: filipino.Write,
            speak: filipino.Speak,
            understand: filipino.Understand,
        };

        const mandarinProf = {
            userId: userId || 0,
            language: "Mandarin",
            read: mandarin.Read,
            write: mandarin.Write,
            speak: mandarin.Speak,
            understand: mandarin.Understand,
        };

        try {
            const englishRes = await UserService.createLanguageProfeciency(englishProf);
            const filipinoRes = await UserService.createLanguageProfeciency(filipinoProf);
            const mandarinRes = await UserService.createLanguageProfeciency(mandarinProf);

            if (englishRes && filipinoRes && mandarinRes) {
                toast.success("Language proficiency saved successfully!");
                if (fromProfile) {
                    router.back();
                } else {
                    setSection("Educational Background")
                }
            }
        } catch (error) {
            toast.error(error.message || "Failed to save language proficiency.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-6 md:p-10 space-y-8"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-primary">Language Proficiency</h2>
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

                {/* English */}
                <LanguageGroup
                    title="English Language"
                    state={english}
                    setState={setEnglish}
                    toggle={toggleCheckbox}
                />

                {/* Filipino */}
                <LanguageGroup
                    title="Filipino Language"
                    state={filipino}
                    setState={setFilipino}
                    toggle={toggleCheckbox}
                />

                {/* Mandarin */}
                <LanguageGroup
                    title="Mandarin Language"
                    state={mandarin}
                    setState={setMandarin}
                    toggle={toggleCheckbox}
                />

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

/* ========== Reusable Component for Each Language ========== */
function LanguageGroup({ title, state, setState, toggle }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-3">{title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.keys(state).map((key) => (
                    <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                            id={`${title}-${key}`}
                            checked={state[key]}
                            onCheckedChange={() => toggle(setState, state, key)}
                            className="border-slate-300 bg-slate-100"
                        />
                        <Label htmlFor={`${title}-${key}`}>{key}</Label>
                    </div>
                ))}
            </div>
        </div>
    );
}
