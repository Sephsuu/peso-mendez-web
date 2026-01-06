import { formatDateToWord } from "@/lib/helper";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function UsersTable({ users, loading, onReload }) {
    const [reason, setReason] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    async function deactivateUser(user) {
        try {
            await UserService.deactivateUser(user.id, reason);
            setSelectedUser(null);
            setReason("");
            onReload();
        } catch (e) {
            alert("Error: " + e);
        }
    }

    if (loading) {
        return (
            <div className="py-10 text-center text-muted-foreground">
                Loading users...
            </div>
        );
    }

    return (
        <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block overflow-x-auto border rounded-lg">
                <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-muted/40">
                        <tr>
                            <th className="border px-3 py-2 text-left">#</th>
                            <th className="border px-3 py-2 text-left">Full Name</th>
                            <th className="border px-3 py-2 text-left">E-mail</th>
                            <th className="border px-3 py-2 text-left">Contact</th>
                            <th className="border px-3 py-2 text-left">Username</th>
                            <th className="border px-3 py-2 text-left">Role</th>
                            <th className="border px-3 py-2 text-left">Status</th>
                            <th className="border px-3 py-2 text-left">Registered At</th>
                            <th className="border px-3 py-2 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user, i) => (
                            <tr
                                key={user.id}
                                className="hover:bg-muted/10"
                            >
                                <td className="border px-3 py-2">
                                    {i + 1}
                                </td>

                                <td className="border px-3 py-2 font-medium">
                                    {user.full_name}
                                </td>

                                <td className="border px-3 py-2">
                                    {user.email}
                                </td>

                                <td className="border px-3 py-2">
                                    {user.contact}
                                </td>

                                <td className="border px-3 py-2">
                                    {user.username}
                                </td>

                                {/* ROLE */}
                                <td className="border px-3 py-2">
                                    <Badge 
                                        variant="secondary" 
                                        className={`capitalize ${user.role === "job_seeker" ? "border border-primary text-primary bg-white" : "bg-primary text-white"}`}
                                    >
                                        {user.role === "job_seeker"
                                            ? "Job Seeker"
                                            : "Employer"}
                                    </Badge>
                                </td>

                                {/* STATUS */}
                                <td className="border px-3 py-2">
                                    <Badge
                                        variant={
                                            user.status === "active"
                                                ? "success"
                                                : "destructive"
                                        }
                                        className="capitalize"
                                    >
                                        {user.status}
                                    </Badge>
                                </td>

                                <td className="border px-3 py-2">
                                    {formatDateToWord(user.created_at)}
                                </td>

                                <td className="border px-3 py-2 text-right">
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        disabled={user.status === "inactive"}
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        Deactivate
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ================= MOBILE CARD VIEW ================= */}
            <div className="md:hidden space-y-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="border rounded-lg p-4 bg-background shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">
                                {user.full_name}
                            </h3>

                            <Badge
                                variant={
                                    user.status === "active"
                                        ? "success"
                                        : "destructive"
                                }
                                className="capitalize"
                            >
                                {user.status}
                            </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground space-y-1">
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Contact:</strong> {user.contact}</p>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p>
                                <strong>Role:</strong>{" "}
                                {user.role === "job_seeker"
                                    ? "Job Seeker"
                                    : "Employer"}
                            </p>
                            <p>
                                <strong>Registered:</strong>{" "}
                                {formatDateToWord(user.created_at)}
                            </p>
                        </div>

                        <Button
                            className="mt-4 w-full"
                            variant="destructive"
                            size="sm"
                            disabled={user.status === "inactive"}
                            onClick={() => setSelectedUser(user)}
                        >
                            Deactivate
                        </Button>
                    </div>
                ))}
            </div>

            {/* ================= CONFIRMATION MODAL ================= */}
            <Dialog
                open={!!selectedUser}
                onOpenChange={() => setSelectedUser(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Deactivate {selectedUser?.full_name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Please provide a reason for deactivating this user.
                        </p>

                        <Textarea
                            rows={4}
                            placeholder="Reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setSelectedUser(null)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            disabled={!reason.trim()}
                            onClick={() => deactivateUser(selectedUser)}
                        >
                            Confirm Deactivation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
