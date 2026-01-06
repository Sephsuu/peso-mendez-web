import { formatDateToWord } from "@/lib/helper";
import { Button } from "@/components/ui/button";

export function EmployersTable({
    claims,
    activeTab,
    employers,
    loading,
}) {
    if (loading) {
        return (
            <div className="py-10 text-center text-muted-foreground">
                Loading employers...
            </div>
        );
    }

    if (!employers.length) {
        return (
            <div className="py-16 text-center text-muted-foreground">
                <p className="text-lg font-semibold">No employers found</p>
                <p className="text-sm">
                    Try changing the filter or check again later.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-[1400px] border-collapse text-sm">
                <thead className="bg-muted/40 border-b">
                    <tr>
                        <th className="border px-4 py-3 text-left">#</th>
                        <th className="border px-4 py-3 text-left">Full Name</th>
                        <th className="border px-4 py-3 text-left">E-mail</th>
                        <th className="border px-4 py-3 text-left">Username</th>
                        <th className="border px-4 py-3 text-left">Contact</th>
                        <th className="border px-4 py-3 text-left">Employer Type</th>
                        <th className="border px-4 py-3 text-left">Gender</th>
                        <th className="border px-4 py-3 text-left">Highest Education</th>
                        <th className="border px-4 py-3 text-left">City/Municipality</th>
                        <th className="border px-4 py-3 text-left">Registered At</th>
                        <th className="border px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {employers.map((item, index) => (
                        <tr
                            key={item.id}
                            className="hover:bg-muted/50"
                        >
                            <td className="border px-4 py-3">
                                {index + 1}
                            </td>
                            <td className="border px-4 py-3 font-medium">
                                {item.full_name || "N/A"}
                            </td>
                            <td className="border px-4 py-3">
                                {item.email || "N/A"}
                            </td>
                            <td className="border px-4 py-3">
                                {item.username || "N/A"}
                            </td>
                            <td className="border px-4 py-3">
                                {item.contact || "N/A"}
                            </td>
                            <td className="border px-4 py-3">
                                {item.employer_type || "N/A"}
                            </td>
                            <td className="border px-4 py-3">
                                {item.sex || "N/A"}
                            </td>
                            <td className="border px-4 py-3">
                                {item.highest_education || "N/A"}
                            </td>
                            <td className="border px-4 py-3">
                                {item.citmun || "N/A"}
                            </td>
                            <td className="border px-4 py-3">
                                {formatDateToWord(item.created_at)}
                            </td>
                            <td className="border px-4 py-3 text-right">
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        window.location.href =
                                            `/admin/employers/${item.id}`
                                    }
                                >
                                    View Documents
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
