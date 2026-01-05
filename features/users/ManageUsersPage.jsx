"use client";

import { useEffect, useMemo, useState } from "react";
import { UserService } from "@/services/user.service";
import { formatDateOnly } from "@/lib/utils";
import { UsersTable } from './components/UsersTable'

export default function ManageUsersPage() {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [find, setFind] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await UserService.getAllUsers();
                setUsers(res || []);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [reload]);

    const filteredUsers = useMemo(() => {
        if (!find) return users;
        return users.filter((u) => {
            const fullName = u.full_name?.toLowerCase() || "";
            const email = u.email?.toLowerCase() || "";
            return (
                fullName.includes(find.toLowerCase()) ||
                email.includes(find.toLowerCase())
            );
        });
    }, [find, users]);

    const activeUsers = filteredUsers.filter(
        (u) => u.status === "active"
    );

    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">
                    Manage Users
                </h1>

                <button
                    className="text-blue-600"
                    onClick={() => window.history.back()}
                >
                    ⬅ Back
                </button>
            </div>

            <input
                type="text"
                placeholder="Search for a user"
                className="w-[90%] border px-3 py-2 mb-4"
                value={find}
                onChange={(e) => setFind(e.target.value)}
            />

            <UsersTable
                users={activeUsers}
                loading={loading}
                onReload={() => setReload(!reload)}
            />
        </div>
    );
}
