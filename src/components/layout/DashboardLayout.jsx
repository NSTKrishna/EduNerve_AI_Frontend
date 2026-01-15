import { useState } from "react";
import { Menu, Search, Bell } from "lucide-react";
import { Outlet } from "react-router-dom";
import LearningSidebar from "./LearningSidebar";
import Button from "../common/Button";
import { useLearner } from "../../context/LearnerContext";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { learnerProfile, authUser } = useLearner();

    const userName = learnerProfile?.name || authUser?.name || "User";
    const userInitials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <LearningSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="lg:ml-72 flex min-h-screen flex-col">
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-white/80 backdrop-blur-sm px-4 lg:px-8 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden inline-flex items-center gap-2 hover:bg-slate-100"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-semibold text-foreground">
                                    {userName}
                                </p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-blue-100">
                                {userInitials}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
