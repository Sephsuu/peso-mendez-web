"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Briefcase,
    Calendar,
    Mail,
    Phone,
    Building2,
    Coins,
} from "lucide-react";
import { toast } from "sonner";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { JobService } from "@/services/job.service";
import { format } from "date-fns";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useClaims } from "@/hooks/use-claims";
import { ApplicationService } from "@/services/application.service";
import { AppFooter } from "@/components/shared/AppFooter";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

export default function ViewJobPage() {
    const { id } = useParams();
    const { claims, loading } = useClaims();

    const userId = claims?.id || claims?.userId;

    const { data: job, loading: jobLoading } = useFetchOne(
        JobService.getJobById,
        [id],
        [id]
    );

    const jobId = job?.id;

    const { data: jobSkills, loading: jobSkillsLoading } = useFetchData(
        JobService.getJobSkills,
        [id],
        [id]
    );

    const { data: saved } = useFetchOne(
        JobService.getSavedJobByUserJob,
        [userId, jobId],
        [userId, jobId]
    );

    const { data: applied } = useFetchOne(
        ApplicationService.getApplicationByJobAndUser,
        [userId, jobId],
        [jobId, userId]
    );

    const [isSaved, setIsSaved] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const isObjectEmpty = (obj) => !obj || Object.keys(obj).length === 0;

    useEffect(() => {
        setIsSaved(!isObjectEmpty(saved));
    }, [saved]);

    useEffect(() => {
        setIsApplied(!isObjectEmpty(applied));
    }, [applied]);

    async function saveJob() {
        try {
            await JobService.saveJob(userId, jobId);
            setIsSaved((prev) => !prev);
            toast.success(
                !isSaved
                    ? "Job successfully saved"
                    : "Job removed from saved list"
            );
        } catch {
            toast.error("Failed to update saved jobs.");
        }
    }

    async function handleConfirmApply() {
        try {
            await ApplicationService.createApplication(jobId, userId);
            setIsApplied(true);
            toast.success("Successfully applied for this job");
        } catch {
            toast.error("Failed to apply for job.");
        } finally {
            setOpenDialog(false);
        }
    }

    async function unapplyJob() {
        try {
            await ApplicationService.deleteApplicationByJobUser(jobId, userId);
            setIsApplied(false);
            toast.success("Successfully unapplied for this job");
        } catch {
            toast.error("Failed to unapply for job.");
        }
    }

    if (loading || jobLoading || jobSkillsLoading)
        return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-linear-to-b from-indigo-100 to-indigo-50 flex flex-col">
            <section className="bg-linear-to-r from-indigo-600 to-indigo-500 text-white py-8 px-5 sm:px-10">
                <div className="max-w-5xl mx-auto flex flex-col gap-5">
                    <h1 className="text-3xl font-bold">{job.title}</h1>
                    <h2 className="text-xl font-medium">{job.company}</h2>

                    <div className="flex flex-wrap gap-4 text-indigo-100 text-sm">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                            <Coins className="w-4 h-4" />
                            {job.salary}
                        </div>
                        <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.type}
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {job.postedOn}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-2">
                        <Button
                            variant="secondary"
                            className={
                                isSaved
                                    ? "bg-yellow-400 text-black hover:bg-yellow-500"
                                    : "bg-white text-indigo-700 hover:bg-indigo-100"
                            }
                            onClick={saveJob}
                        >
                            {isSaved ? "Saved" : "Save Job"}
                        </Button>

                        <Button
                            className={
                                isApplied
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-indigo-700 hover:bg-indigo-800"
                            }
                            onClick={() =>
                                isApplied
                                    ? unapplyJob()
                                    : setOpenDialog(true)
                            }
                        >
                            {isApplied ? "Applied" : "Apply Job"}
                        </Button>
                    </div>
                </div>
            </section>

            <section className="flex-1 w-full max-w-5xl mx-auto px-5 sm:px-10 py-10 space-y-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-indigo-50">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="text-indigo-600">📋</span> Job
                        Description
                    </h3>
                    <p className="mt-3 text-gray-700">
                        {job.description}
                    </p>

                    <h4 className="mt-6 font-semibold text-gray-900">
                        Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {jobSkills?.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm"
                            >
                                {skill.skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-indigo-50">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="text-indigo-600">ℹ️</span> Job Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-700">
                        <DetailItem label="Job Title" value={job.type} />
                        <DetailItem label="Salary" value={job.salary} />
                        <DetailItem label="Location" value={job.location} />
                        <DetailItem
                            label="Date Posted"
                            value={
                                job.created_at
                                    ? format(
                                          new Date(job.created_at),
                                          "MMM dd, yyyy"
                                      )
                                    : "N/A"
                            }
                        />
                        <DetailItem
                            label="Visibility"
                            value={job.visibility}
                        />
                        <DetailItem label="Job Status" value={job.status} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-indigo-50 flex flex-col items-center text-center">
                    <div className="rounded-full border-2 border-indigo-400 p-4 w-24 h-24 flex items-center justify-center mb-4">
                        <Building2 className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h3 className="text-lg font-semibold">{job.full_name}</h3>
                    <p className="text-gray-500">Employer</p>

                    <div className="mt-4 space-y-1 text-gray-700">
                        <p className="flex items-center justify-center gap-2">
                            <Mail className="w-4 h-4 text-indigo-600" />{" "}
                            {job.email}
                        </p>
                        <p className="flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4 text-indigo-600" />{" "}
                            {job.contact}
                        </p>
                    </div>

                    <Button className="w-full sm:w-1/2 mt-5 bg-blue-600 hover:bg-blue-700">
                        Send Message
                    </Button>
                </div>
            </section>

            {/* Apply Confirmation Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Application</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to apply for{" "}
                            <strong>{job?.title}</strong> at {job?.company}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setOpenDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmApply}
                            className="bg-indigo-700 hover:bg-indigo-800"
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AppFooter />
        </div>
    );
}

function DetailItem({ label, value }) {
    return (
        <div>
            <p className="font-medium text-indigo-600">{label}:</p>
            <p>{value}</p>
        </div>
    );
}
