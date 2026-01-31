"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Shield, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
    const pathname = usePathname();

    const navItems = [
        { name: "Inicio", href: "/admin", icon: LayoutDashboard },
        { name: "Torneos", href: "/admin/tournaments", icon: Trophy },
        { name: "Equipos", href: "/admin/teams", icon: Shield },
        { name: "Ajustes", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t md:hidden h-16 pb-safe">
            <nav className="flex h-full items-center justify-around">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
