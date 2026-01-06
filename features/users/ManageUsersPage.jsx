"use client";

import { useEffect, useMemo, useState } from "react";
import { UserService } from "@/services/user.service";
import { UsersTable } from './components/UsersTable'
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ManageUsersPage() {
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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between my-2">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <h1 className="text-xl font-semibold tracking-tight">
                        Manage Users
                    </h1>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md my-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search by name or email"
                    className="pl-9"
                    value={find}
                    onChange={(e) => setFind(e.target.value)}
                />
            </div>

            <UsersTable
                users={activeUsers}
                loading={loading}
                onReload={() => setReload(!reload)}
            />
        </div>
    );
}
