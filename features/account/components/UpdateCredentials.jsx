"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserService } from "@/services/user.service";
import { AuthService } from "@/services/auth.service";

export function UpdateCredentials({ user, open, setOpen }) {
    // Pre-filled values
    const [fullName, setFullName] = useState(user.full_name || "");
    const [username, setUsername] = useState(user.username || "");
    const [contact, setContact] = useState(user.contact || "");

    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        try {
            setLoading(true);

            const payload = {
                ...user,
                full_name: fullName,
                username,
                contact,
            };

            const res = await UserService.updateUserCredential(payload);

            if (res) {
                toast.success("Credential updated successfully! Please re-login.");
                localStorage.removeItem("jwt_token");
                window.location.href="/auth/login"
            }
        } catch (e) {
            toast.error(e.message || "Update failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-white">Edit Credentials</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md max-h-10/11 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Edit Your Credentials
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">

                    {/* FULL NAME */}
                    <div className="space-y-1">
                        <Label>Full Name</Label>
                        <Input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="bg-blue-50 border-primary/30"
                        />
                    </div>

                    {/* USERNAME */}
                    <div className="space-y-1">
                        <Label>Username</Label>
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-blue-50 border-primary/30"
                        />
                    </div>

                    {/* CONTACT NUMBER */}
                    <div className="space-y-1">
                        <Label>Contact Number</Label>
                        <Input
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="bg-blue-50 border-primary/30"
                        />
                    </div>

                    {/* READONLY FIELDS */}
                    <div className="space-y-1">
                        <Label>Email Address (readonly)</Label>
                        <Input value={user.email} readOnly disabled className="opacity-50" />
                    </div>

                    <div className="space-y-1">
                        <Label>Role (readonly)</Label>
                        <Input value={user.role} readOnly disabled className="opacity-50" />
                    </div>

                    <div className="space-y-1">
                        <Label>Status (readonly)</Label>
                        <Input value={user.status} readOnly disabled className="opacity-50" />
                    </div>

                    <div className="space-y-1">
                        <Label>Account Created (readonly)</Label>
                        <Input value={user.created_at} readOnly disabled className="opacity-50" />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        className="bg-primary text-white"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
