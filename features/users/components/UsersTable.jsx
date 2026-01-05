import { useState } from "react";

export function UsersTable({ users, loading, onReload }) {
    const [reason, setReason] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    async function deactivateUser(user) {
        try {
            await UserService.deactivateUser(user.id, reason);
            alert("User successfully deactivated.");
            setSelectedUser(null);
            setReason("");
            onReload();
        } catch (e) {
            alert("Error: " + e);
        }
    }

    if (loading) {
        return (
            <div className="mt-10 text-center">
                Loading...
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto border">
                <table className="min-w-[1200px] w-full text-sm border-collapse">
                    <thead className="bg-gray-200">
                        <tr>
                            {[
                                "#",
                                "Full Name",
                                "E-mail",
                                "Contact",
                                "Username",
                                "Role",
                                "Status",
                                "Registered At",
                                "Actions",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="border px-2 py-2 text-left"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user, i) => (
                            <tr
                                key={user.id}
                                className="border-t"
                            >
                                <td className="border px-2">
                                    {i + 1}
                                </td>

                                <td className="border px-2">
                                    {user.full_name}
                                </td>

                                <td className="border px-2">
                                    {user.email}
                                </td>

                                <td className="border px-2">
                                    {user.contact}
                                </td>

                                <td className="border px-2">
                                    {user.username}
                                </td>

                                <td className="border px-2">
                                    <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                                        {user.role === "job_seeker"
                                            ? "Job Seeker"
                                            : "Employer"}
                                    </span>
                                </td>

                                <td className="border px-2">
                                    <span
                                        className={`px-2 py-1 rounded text-xs text-white ${
                                            user.status === "active"
                                                ? "bg-green-600"
                                                : "bg-red-600"
                                        }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>

                                <td className="border px-2">
                                    {formatDateOnly(user.created_at)}
                                </td>

                                <td className="border px-2">
                                    <button
                                        disabled={user.status === "inactive"}
                                        className="bg-red-600 text-white px-2 py-1 text-xs rounded disabled:opacity-50"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        Deactivate
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-5 w-[400px] rounded">
                        <h2 className="font-semibold mb-2">
                            Deactivate {selectedUser.full_name}
                        </h2>

                        <textarea
                            className="w-full border p-2 mb-4"
                            placeholder="Reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                className="px-3 py-1 border"
                                onClick={() => setSelectedUser(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-3 py-1 bg-red-600 text-white"
                                onClick={() => deactivateUser(selectedUser)}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
