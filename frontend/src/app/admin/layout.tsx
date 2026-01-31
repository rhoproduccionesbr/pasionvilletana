"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Shield, Users, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/layout/MobileNav";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Torneos", href: "/admin/tournaments", icon: Trophy },
        { name: "Equipos", href: "/admin/teams", icon: Shield },
        { name: "Jugadores", href: "/admin/players", icon: Users },
        { name: "Configuración", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-muted/20">

            {/* Desktop Sidebar (Hidden on Mobile) */}
            <aside className="hidden md:flex w-64 bg-background border-r flex-col fixed inset-y-0 z-40">
                <div className="h-16 flex items-center px-6 border-b bg-card">
                    <Trophy className="h-6 w-6 text-primary mr-2" />
                    <span className="font-bold text-lg">Admin LVF</span>
                </div>
                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:pl-64 flex flex-col min-h-screen pb-20 md:pb-0">
                {/* Mobile Header */}
                <header className="md:hidden h-14 border-b bg-background/80 backdrop-blur-md flex items-center px-4 sticky top-0 z-30">
                    <Trophy className="h-5 w-5 text-primary mr-2" />
                    <span className="font-bold">Systema LVF</span>
                </header>

                {/* Content */}
                <div className="flex-1 p-4 md:p-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileNav />
        </div>
    );
}
