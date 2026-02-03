import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <div className="hidden lg:block">
                <Sidebar />
            </div>
            <div className="flex flex-1 flex-col overflow-hidden pb-16 lg:pb-0">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50/50 dark:bg-slate-950/50">
                    {children}
                </main>
            </div>
            <BottomNav />
        </div>
    );
}
