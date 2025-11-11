"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const routes = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Job Listings", href: "/jobs" },
    { title: "Contact", href: "/contact" },
];

export function AppNavbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-slate-50 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:py-5">
                {/* Logo */}
                <div className="font-bold text-xl md:text-2xl text-primary">
                    Mendez PESO Job Portal
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {routes.map((item, i) => (
                        <Link
                            href={item.href}
                            key={i}
                            className="font-medium text-gray-700 hover:text-primary transition-colors"
                        >
                            {item.title}
                        </Link>
                    ))}
                    <Button className="bg-primary text-white hover:opacity-90">
                        Sign in / Register
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-primary"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64 bg-slate-50">
                            <SheetHeader>
                                <SheetTitle className="text-primary text-lg font-semibold">
                                    Mendez PESO Job Portal
                                </SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 flex flex-col gap-4">
                                {routes.map((item, i) => (
                                    <Link
                                        key={i}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="text-gray-700 font-medium hover:text-primary transition-colors"
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                                <Button
                                    onClick={() => setOpen(false)}
                                    className="mt-4 bg-primary text-white hover:opacity-90"
                                >
                                    Sign in / Register
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
