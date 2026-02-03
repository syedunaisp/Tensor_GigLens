"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Briefcase, Calculator, Target, User, HelpCircle, LogOut, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const { t } = useLanguage();

    const routes = [
        {
            label: t.nav_dashboard,
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-sky-500",
        },
        {
            label: t.nav_jobs,
            icon: Briefcase,
            href: "/jobs",
            color: "text-violet-500",
        },
        {
            label: t.nav_simulator,
            icon: Calculator,
            href: "/simulator",
            color: "text-pink-700",
        },
        {
            label: t.nav_goals,
            icon: Target,
            href: "/goals",
            color: "text-orange-700",
        },
        {
            label: t.nav_profile,
            icon: User,
            href: "/profile",
            color: "text-gray-500",
        },
        {
            label: t.nav_help,
            icon: HelpCircle,
            href: "/help",
            color: "text-green-600",
        },
    ];

    return (
        <div className="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Activity className="h-6 w-6" />
                    <span>GigLens</span>
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto py-4 flex flex-col">
                <nav className="space-y-1 p-4">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                                pathname === route.href
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-muted-foreground hover:bg-sidebar-accent/50"
                            )}
                        >
                            <route.icon className={cn("h-5 w-5", route.color)} />
                            {route.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="border-t p-4">
                <Button
                    onClick={logout}
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-sidebar-accent/50"
                >
                    <LogOut className="h-5 w-5 mr-3 text-red-500" />
                    {t.nav_logout}
                </Button>
            </div>
        </div>
    );
}
