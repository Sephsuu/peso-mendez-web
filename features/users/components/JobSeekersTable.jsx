import { formatDateToWord } from "@/lib/helper";

export default function JobSeekersTable({ jobSeekers, loading }) {
    if (loading) {
        return (
            <div className="py-10 text-center text-muted-foreground">
                Loading job seekers...
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Horizontal Scroll Wrapper */}
            <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-[1400px] border-collapse text-sm">
                    <thead className="bg-muted/40 border-b">
                        <tr>
                            <th className="border px-4 py-3 text-left w-[60px]">#</th>
                            <th className="border px-4 py-3 text-left min-w-[220px]">
                                Full Name
                            </th>
                            <th className="border px-4 py-3 text-left min-w-[220px]">
                                E-mail
                            </th>
                            <th className="border px-4 py-3 text-left min-w-[160px]">
                                Username
                            </th>
                            <th className="border px-4 py-3 text-left min-w-[160px]">
                                Contact
                            </th>
                            <th className="border px-4 py-3 text-left min-w-[120px]">
                                Gender
                            </th>
                            <th className="border px-4 py-3 text-left min-w-[160px]">
                                Clientele
                            </th>
                            <th className="border px-4 py-3 text-left min-w-[200px]">
                                Highest Education
                            </th>
                            <th className="border px-4 py-3 text-left min-w-[200px]">
                                City / Municipality
                            </th>
                            <th className="border px-4 py-3 text-left min-w-[160px]">
                                Registered At
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {jobSeekers.map((user, index) => (
                            <tr
                                key={user.id}
                                className="hover:bg-muted/10"
                            >
                                <td className="border px-4 py-3 text-center">
                                    {index + 1}
                                </td>

                                <td className="border px-4 py-3 font-medium whitespace-nowrap">
                                    {user.full_name || "N/A"}
                                </td>

                                <td className="border px-4 py-3 whitespace-nowrap">
                                    {user.email || "N/A"}
                                </td>

                                <td className="border px-4 py-3 whitespace-nowrap">
                                    {user.username || "N/A"}
                                </td>

                                <td className="border px-4 py-3 whitespace-nowrap">
                                    {user.contact || "N/A"}
                                </td>

                                <td className="border px-4 py-3">
                                    {user.sex || "N/A"}
                                </td>

                                <td className="border px-4 py-3">
                                    {user.clientele || "N/A"}
                                </td>

                                <td className="border px-4 py-3">
                                    {user.highest_education || "N/A"}
                                </td>

                                <td className="border px-4 py-3">
                                    {user.citmun || "N/A"}
                                </td>

                                <td className="border px-4 py-3 whitespace-nowrap">
                                    {formatDateToWord(user.created_at)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Optional scroll hint (desktop UX) */}
            <div className="mt-2 text-xs text-muted-foreground">
                Scroll horizontally to view all columns →
            </div>
        </div>
    );
}
