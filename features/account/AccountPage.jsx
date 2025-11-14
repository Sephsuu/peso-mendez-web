"use client";

import { useState } from "react";
import { CredentialsSection } from '@/features/account/components/CredentialsSection'

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
                {tab === 'Credentials' && (
                    <CredentialsSection />
                )}
            </div>
        </section>
    );
}
