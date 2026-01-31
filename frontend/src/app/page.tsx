import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Shield, Calendar, Users, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black text-white selection:bg-primary/30">
            {/* Navbar / Top Bar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container max-w-md mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <span className="font-bold tracking-tight">Systema LVF</span>
                    </div>
                    <Link href="/admin">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white hover:bg-white/5">
                            <Lock className="h-4 w-4 mr-2" />
                            Admin
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="container max-w-md mx-auto pt-24 px-4 pb-12 flex flex-col gap-8 min-h-screen">

                {/* Hero Section */}
                <div className="relative isolate">
                    {/* Glow Effect */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 -z-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px] opacity-60 animate-pulse"></div>

                    <div className="text-center space-y-4 py-8">
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/5 border border-yellow-500/20 shadow-2xl shadow-yellow-500/10 mb-4">
                            <Trophy className="h-12 w-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Súper Liga<br />Villetana
                        </h1>
                        <p className="text-lg text-muted-foreground font-medium">
                            Temporada 2025
                        </p>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-muted/10 border-white/5 hover:bg-muted/20 hover:border-primary/20 transition-all cursor-pointer group hover:-translate-y-1">
                        <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                            <div className="p-3 rounded-full bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <span className="font-semibold text-sm">Fixture</span>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/10 border-white/5 hover:bg-muted/20 hover:border-primary/20 transition-all cursor-pointer group hover:-translate-y-1">
                        <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                                <Shield className="h-6 w-6" />
                            </div>
                            <span className="font-semibold text-sm">Clubes</span>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/10 border-white/5 hover:bg-muted/20 hover:border-primary/20 transition-all cursor-pointer group hover:-translate-y-1">
                        <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                            <div className="p-3 rounded-full bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                                <Users className="h-6 w-6" />
                            </div>
                            <span className="font-semibold text-sm">Jugadores</span>
                        </CardContent>
                    </Card>

                    <Link href="/admin">
                        <Card className="bg-muted/10 border-white/5 hover:bg-muted/20 hover:border-primary/20 transition-all cursor-pointer group hover:-translate-y-1 h-full">
                            <CardContent className="p-4 flex flex-col items-center text-center gap-3 h-full justify-center">
                                <div className="p-3 rounded-full bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-colors">
                                    <Lock className="h-6 w-6" />
                                </div>
                                <span className="font-semibold text-sm">Panel Admin</span>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Latest News / Featured Match Placeholder */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold tracking-tight">Partido Destacado</h2>
                        <Button variant="link" size="sm" className="text-xs text-muted-foreground h-auto p-0 hover:text-white">
                            Ver todo <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-card/40 to-card/10 backdrop-blur-md">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50"></div>
                        <div className="p-6 text-center relative z-10">
                            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">Gran Final • Domingo 15:00</span>

                            <div className="flex items-center justify-center gap-6 mb-4">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 animate-pulse"></div>
                                    <span className="font-bold text-sm">LOCAL</span>
                                </div>
                                <span className="text-2xl font-black text-white/50">VS</span>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 animate-pulse"></div>
                                    <span className="font-bold text-sm">VISITA</span>
                                </div>
                            </div>

                            <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">
                                Ver Detalles del Partido
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-auto py-8 text-center text-xs text-muted-foreground border-t border-white/5">
                    <p>© 2025 Liga Villetana de Fútbol</p>
                    <p className="mt-1">Designed by Systema LVF</p>
                </footer>
            </main>
        </div>
    );
}
