import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, FileText, Mail, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RegisterPage } from '@/features/auth/RegisterPage'
import { useRef, useState } from "react";
import { useClaims } from "@/hooks/use-claims";
import { UserService } from "@/services/user.service";
import Loader from "@/components/ui/loader";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { BASE_URL } from "@/services/_config";
import { toast } from "sonner";
import {  UpdateCredentials } from '@/features/account/components/UpdateCredentials'

export function CredentialsSection() {
    const { claims, loading: authLoading } = useClaims();
    const userId = claims?.id || claims?.userId;
    const { data, loading } = useFetchOne(UserService.getUserCredential, [userId], [userId]);
    const [toEdit, setEdit] = useState(false);
    
    if (authLoading || loading) return <Loader />
    if (!data) return <div>Error</div>
    return (
        <>
            {toEdit ? <UpdateCredentials user={ data } open={ toEdit } setOpen={ setEdit } />
            : (
                <ScrollArea className="max-h-screen overflow-y-auto bg-gray-50">
                    {/* Header */}
                    <div className="bg-linear-to-l from-[#73b9ff] to-[#0a6aff] text-white px-6 py-10 md:px-16 lg:px-24">
                        <h1 className="text-3xl font-semibold">{ data.full_name }</h1>

                        <div className="flex items-center gap-2 mt-3 text-sm opacity-90">
                            <User size={16} />
                            <span>@{ data.username }</span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-sm opacity-90">
                            <Mail size={16} />
                            <span>{ data.email }</span>
                        </div>

                        <Button 
                            variant="secondary"
                            onClick={() => setEdit(!toEdit)}
                            className="mt-5 bg-light"
                        >
                            Edit Profile
                        </Button>
                    </div>

                    {/* Content Wrapper (desktop nicer) */}
                    <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-6 pb-20 mt-4">
                        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">

                            {/* Contact Number */}
                            <div className="mb-6">
                                <p className="font-semibold text-gray-700">Contact Number:</p>
                                <p className="mt-1 text-gray-600">{ data.contact }</p>
                            </div>

                            {/* Role */}
                            <div className="mb-6">
                                <p className="font-semibold text-gray-700">Role:</p>
                                <Badge className="mt-2 bg-blue-600 text-white px-3 py-1 text-sm">
                                    { data.role === "job_seeker" && "Job Seeker"}
                                </Badge>
                            </div>

                            {/* Status */}
                            <div className="mb-8">
                                <p className="font-semibold text-gray-700">Status:</p>
                                <p className="mt-1 text-gray-600 uppercase">{ data.status }</p>
                            </div>

                            {/* Resume Section */}
                            <ResumeCard 
                                user={data} 
                                refresh={() => setEdit(false)} 
                            />


                            {/* Account Created */}
                            <div>
                                <p className="font-semibold text-gray-700">Account Created:</p>
                                <p className="mt-1 text-gray-600 text-sm md:text-base">
                                    { data.created_at }
                                </p>
                            </div>

                        </div>
                    </div>
                </ScrollArea>
            )}
        </>
    )
}

function ResumeCard({ user, refresh }) {
    const [filename, setFilename] = useState(
        user.document_path ? extractName(user.document_path) : "No resume uploaded"
    );
    const [pickedFile, setPickedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    function extractName(path) {
        return path.split("/").pop();
    }

    function pickFile(e) {
        const file = e.target.files?.[0];
        if (!file) return toast.error("No file selected.");

        const allowed = ["pdf", "docx", "rtf", "txt"];
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!allowed.includes(ext)) return toast.error("Invalid file type.");

        setPickedFile(file);
        setFilename(file.name);
    }

    async function uploadFile() {
        if (!pickedFile) return toast.error("Please select a file first.");
        try {
            setIsUploading(true);

            const form = new FormData();
            form.append("file", pickedFile);

            const uploadRes = await fetch(`${BASE_URL}/upload/resume`, {
                method: "POST",
                body: form
            }).then((r) => r.json());

            if (!uploadRes.filePath) return toast.error("Upload failed.");

            await UserService.updateUserCredential({
                ...user,
                document_path: uploadRes.filePath
            });

            toast.success("Resume uploaded successfully!");
            refresh?.();
        } catch (err) {
            toast.error("Upload error: " + err.message);
        } finally {
            setIsUploading(false);
        }
    }

    function viewFile() {
        if (!user.document_path) return toast.error("No resume uploaded yet.");

        const url = user.document_path.startsWith("http")
            ? user.document_path
            : `${BASE_URL}/${user.document_path}`;

        window.open(url, "_blank");
    }

    return (
        <div className="bg-gray-100 border rounded-xl px-5 py-5 shadow-sm mb-10">
            {/* ICON + FILE NAME */}
            <div className="grid grid-cols-[auto_1fr] gap-3">
                <svg
                    width="26"
                    height="26"
                    className="text-gray-600"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>

                <div>
                    <p className="font-semibold text-gray-800 break-words">
                        {filename}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Accepted: PDF, DOCX, RTF, TXT
                    </p>
                </div>
            </div>

            {/* SPACING */}
            <div className="h-4"></div>

            {/* BUTTONS – STACKED (NO FLEX) */}
            <div className="grid gap-2">

                {/* VIEW BUTTON */}
                <Button
                    className="bg-blue-600 text-white w-full"
                    onClick={viewFile}
                >
                    View
                </Button>

                {/* CHOOSE FILE */}
                <Button
                    className="bg-green-600 text-white w-full"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Choose File
                </Button>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={pickFile}
                />

                {/* UPLOAD BUTTON */}
                <Button
                    className="bg-emerald-600 text-white w-full"
                    onClick={uploadFile}
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading…" : "Upload"}
                </Button>
            </div>

        </div>
    );
}
