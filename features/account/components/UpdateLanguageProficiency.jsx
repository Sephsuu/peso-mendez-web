"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { UserService } from "@/services/user.service";

export function UpdateLanguageProficiency({ open, setOpen, user, userId, setReload }) {
    const defaultLanguages = {
        "Mandarin": { 
            id: null, 
            language: "Mandarin",
            read: false, 
            write: false, 
            speak: false, 
            understand: false 
        },
        "Filipino": { 
            id: null, 
            language: "Filipino",
            read: false, 
            write: false, 
            speak: false, 
            understand: false 
        },
        "English": { 
            id: null, 
            language: "English",
            read: false, 
            write: false, 
            speak: false, 
            understand: false 
        },
    };

    const [form, setForm] = useState(!user || Object.keys(user).length === 0 ? defaultLanguages : user);

    useEffect(() => {
        if (!open) return;

        // If no user data → show defaults
        if (!user || user.length === 0) {
            setForm(defaultLanguages);
            return;
        }

        // If user has data → merge into defaults (keeps missing languages)
        const updated = { ...defaultLanguages };

        user.forEach(item => {
            updated[item.language] = {
                id: item.id,
                language: item.language,
                read: item.read === 1,
                write: item.write === 1,
                speak: item.speak === 1,
                understand: item.understand === 1
            };
        });

        setForm(updated);

    }, [open, user]);

    function updateField(language, key, value) {
        setForm(prev => ({
            ...prev,
            [language]: {
                ...prev[language],
                [key]: value
            }
        }));
    }

    async function handleSubmit() {
        try {
            const payload = Object.keys(form).map(language => ({
                id: form[language].id,
                language: language,
                read: form[language].read ? 1 : 0,
                write: form[language].write ? 1 : 0,
                speak: form[language].speak ? 1 : 0,
                understand: form[language].understand ? 1 : 0,
                userId: userId,
            }));

            if (!user || Object.keys(user).length === 0) {
                for (const lang of payload) {
                    delete lang.id;
                    await UserService.createLanguageProfeciency(lang);
                }
                toast.success("Language proficiency created successfully!")
                setOpen(false)
                return;
            }

            for (const lang of payload) {
                await UserService.updateUserLanguageProficiency(lang);
            }

            toast.success("Language proficiency updated!");
            setReload(prev => !prev)
            setOpen(false);

        } catch (err) {
            toast.error(err.message || "Failed to update language proficiency.");
        }
    }

    useEffect(() => {
        console.log(form);
        
    }, [form])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Edit Language Proficiency
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-5 py-4">

                    {Object.keys(form).map(language => (
                        <div
                            key={language}
                            className="border rounded-md p-4 bg-white shadow-sm space-y-3"
                        >
                            <h3 className="font-semibold text-lg">{language} Language</h3>

                            <CheckboxRow
                                label="Read"
                                checked={form[language].read}
                                onChange={val => updateField(language, "read", val)}
                            />

                            <CheckboxRow
                                label="Write"
                                checked={form[language].write}
                                onChange={val => updateField(language, "write", val)}
                            />

                            <CheckboxRow
                                label="Speak"
                                checked={form[language].speak}
                                onChange={val => updateField(language, "speak", val)}
                            />

                            <CheckboxRow
                                label="Understand"
                                checked={form[language].understand}
                                onChange={val => updateField(language, "understand", val)}
                            />
                        </div>
                    ))}

                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        className="ms-auto w-fit bg-primary text-white"
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function CheckboxRow({ label, checked, onChange }) {
    return (
        <label className="flex items-center justify-between py-1">
            <span className="text-gray-700">{label}</span>

            <Checkbox
                checked={checked}
                onCheckedChange={(v) => onChange(v)}
                className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
            />
        </label>
    );
}
