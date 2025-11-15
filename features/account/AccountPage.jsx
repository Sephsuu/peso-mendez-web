"use client";

import { useState } from "react";
import { CredentialsSection } from '@/features/account/components/CredentialsSection'
import { PersonalInformationSection } from '@/features/account/components/PersonalInformationSection'
import { JobReferenceSection } from '@/features/account/components/JobReferenceSection'
import { LanguageProficiencySection } from '@/features/account/components/LanguageProficencySection'


const sections = [
    "Credentials",
    "Personal Information",
    "Job Reference",
    "Language Profeciency",
    "Educational Background",
    "TechVoc Trainings",
    "Eligibility",
    "Work Experience",
    "Other Skills",
];

export function AccountPage() {
    const [tab, setTab] = useState(sections[0])
    return (
        <section className="grid grid-cols-4">
            <div className="h-full flex flex-col gap-4 font-semibold text-secondary border-r shadow-sm mt-4">
                {sections.map((item) => (
                    <button
                        onClick={() => setTab(item)}
                        className={`py-2 ${item === tab && "bg-primary rounded-md text-light mx-2"}`}
                        key={item}
                    >
                        { item }
                    </button>
                ))}
            </div>

            <div className="col-span-3">
                {tab === sections[0] && (<CredentialsSection />)}
                {tab === sections[1] && (<PersonalInformationSection />)}
                {tab === sections[2] && (<JobReferenceSection />)}
                {tab === sections[3] && (<LanguageProficiencySection />)}
            </div>
        </section>
    );
}
