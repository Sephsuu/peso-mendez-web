"use client";

import { useState } from "react";
import { CredentialsSection } from '@/features/account/components/CredentialsSection'
import { PersonalInformationSection } from '@/features/account/components/PersonalInformationSection'
import { JobReferenceSection } from '@/features/account/components/JobReferenceSection'
import { LanguageProficiencySection } from '@/features/account/components/LanguageProficencySection'
import { EducationalBackgroundSection } from "./components/EducationalBackgroundSection";
import { TechVocTrainingsSection } from "./components/TechVocTrainingsSection";
import { EligibilityAndLicenseSection } from "./components/EligibilitySection";
import { WorkExperienceSection } from "./components/WorkExperienceSection";

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
                {tab === sections[4] && (<EducationalBackgroundSection />)}
                {tab === sections[5] && (<TechVocTrainingsSection />)}
                {tab === sections[6] && (<EligibilityAndLicenseSection />)}
                {tab === sections[7] && (<WorkExperienceSection />)}
            </div>
        </section>
    );
}
