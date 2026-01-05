"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Folder, RefreshCcw } from "lucide-react";
import { useClaims } from "@/hooks/use-claims";
import { useFetchData } from "@/hooks/use-fetch-data";
import { VerificationService } from "@/services/verification.service";
import { SectionLoader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";


export function EmployerVerificationQueue() {
    const [reload, setReload] = useState(false)
    const { claims, loading: loadingAuth } = useClaims();
    const { data: verifications, loading: loadingVerifications } = useFetchData(
        VerificationService.getVerificationsByRole,
        [reload],
        ['']
    )
   
    return (
        <section className="px-4 mt-6">
            <div className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-slate-800" />
                <h2 className="text-xl font-semibold text-slate-900">
                    Employer Verification Queue
                </h2>
            </div>

            <div className="mt-4 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                {loadingVerifications ? (
                    <SectionLoader />
                ) : verifications.length === 0 ? (
                    <div className="py-10 text-center text-slate-400">
                        No employer verifications found.
                    </div>
                ) : (
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-[720px] w-full text-sm">
                                <thead className="bg-slate-100">
                                    <tr className="text-left">
                                        <th className="px-3 py-3 font-semibold text-slate-700">
                                            Employer Name
                                        </th>
                                        <th className="px-3 py-3 font-semibold text-slate-700">
                                            Email
                                        </th>
                                        <th className="px-3 py-3 font-semibold text-slate-700">
                                            Status
                                        </th>
                                        <th className="px-3 py-3 font-semibold text-slate-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white">
                                    {verifications.map((item, idx) => {
                                        const employerName = item?.full_name || "—";
                                        const email = item?.email || "—";
                                        const status = item?.status || "—";

                                        return (
                                            <tr
                                                key={item?.id ?? idx}
                                                className="border-t border-slate-100"
                                            >
                                                <td className="px-3 py-3 font-semibold text-slate-900">
                                                    {employerName}
                                                </td>

                                                <td className="px-3 py-3 text-slate-700">
                                                    {email}
                                                </td>

                                                <td className="px-3 py-3">
                                                    <span
                                                        className={[
                                                            "inline-flex uppercase items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset",
                                                            status?.toLowerCase() === "pending"
                                                                ? "bg-amber-50 text-amber-700 ring-amber-200"
                                                                : status?.toLowerCase() === "approved"
                                                                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                                                    : status?.toLowerCase() === "rejected"
                                                                        ? "bg-rose-50 text-rose-700 ring-rose-200"
                                                                        : "bg-slate-50 text-slate-700 ring-slate-200",
                                                        ].join(" ")}
                                                    >
                                                        {status}
                                                    </span>
                                                </td>


                                                <td className="px-3 py-3">
                                                    {/* Option A: Navigate to a page with query params */}
                                                    <Link
                                                        href={`/admin/employers/${item?.user_id ?? item?.id}/documents`}
                                                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.99]"
                                                    >
                                                        View Documents
                                                    </Link>

                                                    {/* Option B: If you prefer onClick navigation:
                                                        <button
                                                            type="button"
                                                            onClick={() => router.push(`/admin/employers/${item?.user_id ?? item?.id}/documents`)}
                                                            className="..."
                                                        >
                                                            View Documents
                                                        </button>
                                                    */}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2 h-8">
                            <Button
                                type="button"
                                variant="sm"
                                onClick={() => setReload((v) => !v)}
                                className="border border-primary text-primary bg-white rounded-md px-2 font-semibold hover:opacity-90"
                            >
                               <RefreshCcw /> Refresh
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
