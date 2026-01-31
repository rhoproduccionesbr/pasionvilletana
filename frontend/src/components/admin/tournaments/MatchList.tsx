"use client";

import { useState, useEffect } from "react";
import { matchService } from "@/lib/services/matches";
import { Match, Tournament } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { element } from "prop-types";
import { MatchEditDialog } from "./MatchEditDialog";

export function MatchList({ tournament }: { tournament: Tournament }) {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'primera' | 'juvenil'>('all');
    const [editingMatch, setEditingMatch] = useState<Match | null>(null);

    const fetchMatches = async () => {
        if (!tournament.id) return;
        setLoading(true);
        try {
            const data = await matchService.getByTournament(tournament.id);
            setMatches(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, [tournament.id]);

    // Group by Round
    const matchesByRound = matches.reduce((acc, match) => {
        const round = match.round || 0;
        if (!acc[round]) acc[round] = [];
        acc[round].push(match);
        return acc;
    }, {} as Record<number, Match[]>);

    const rounds = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b);

    const filteredMatches = (roundMatches: Match[]) => {
        if (categoryFilter === 'all') return roundMatches;
        return roundMatches.filter(m => m.category === categoryFilter);
    };

    if (loading) return <div className="text-center p-4">Cargando partidos...</div>;
    if (matches.length === 0) return <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-lg">No hay partidos programados. Usa el Generador de Fixture.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Calendario de Partidos</h3>
                <Tabs value={categoryFilter} onValueChange={(v: any) => setCategoryFilter(v)}>
                    <TabsList>
                        <TabsTrigger value="all">Todos</TabsTrigger>
                        <TabsTrigger value="primera">Primera</TabsTrigger>
                        <TabsTrigger value="juvenil">Juvenil</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="space-y-8">
                {rounds.map(round => {
                    const roundMatches = filteredMatches(matchesByRound[round]);
                    if (roundMatches.length === 0) return null;

                    return (
                        <div key={round} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-1 bg-gradient-to-b from-primary to-blue-600 rounded-full"></div>
                                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Fecha {round}</h4>
                                <span className="text-xs text-muted-foreground/50 ml-auto">
                                    {roundMatches[0].date && format(new Date(roundMatches[0].date), "dd MMM yyyy")}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {roundMatches.map(match => (
                                    <div
                                        key={match.id}
                                        onClick={() => setEditingMatch(match)}
                                        className="group relative overflow-hidden border rounded-2xl bg-gradient-to-br from-card/50 to-card/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer"
                                    >
                                        {/* Status Header */}
                                        <div className="flex justify-between items-center px-4 py-2 bg-muted/20 border-b border-white/5">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3 h-3 text-primary" />
                                                <span className="text-xs font-mono font-medium text-muted-foreground">
                                                    {match.date ? format(new Date(match.date), "EEE dd/MM - HH:mm") : "A confirmar"}
                                                </span>
                                            </div>
                                            <Badge variant={match.category === 'primera' ? 'default' : 'secondary'} className={`text-[10px] h-5 shadow-none ${match.category === 'primera' ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'bg-orange-500/20 text-orange-600 hover:bg-orange-500/30'}`}>
                                                {match.category === 'primera' ? 'PRIMERA' : 'JUVENIL'}
                                            </Badge>
                                        </div>

                                        {/* Match Body */}
                                        <div className="p-4 flex items-center justify-between gap-4">
                                            {/* Home */}
                                            <div className="flex flex-col items-center gap-2 flex-1 text-center">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-black p-0.5 shadow-xl ring-2 ring-white/10 group-hover:ring-primary/50 transition-all">
                                                        <div className="w-full h-full rounded-full bg-black/50 flex items-center justify-center overflow-hidden">
                                                            {match.teams.home.logoUrl ? (
                                                                <img src={match.teams.home.logoUrl} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-xs font-black text-white/30">{match.teams.home.name.substring(0, 2)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-tight leading-tight line-clamp-2 h-8 flex items-center">{match.teams.home.name}</span>
                                            </div>

                                            {/* Scoreboard */}
                                            <div className="flex flex-col items-center justify-center gap-1 z-10 w-20">
                                                <div className="flex items-center justify-center gap-3 text-3xl font-black tabular-nums tracking-tighter group-hover:text-primary transition-colors">
                                                    <span className={match.status === 'finished' ? "text-foreground" : "text-muted-foreground/30"}>
                                                        {match.status === 'finished' ? match.teams.home.score : "-"}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground font-light mb-1">:</span>
                                                    <span className={match.status === 'finished' ? "text-foreground" : "text-muted-foreground/30"}>
                                                        {match.status === 'finished' ? match.teams.away.score : "-"}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest bg-muted/50 px-2 py-0.5 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                    {match.status === 'finished' ? 'FINAL' : 'VS'}
                                                </span>
                                            </div>

                                            {/* Away */}
                                            <div className="flex flex-col items-center gap-2 flex-1 text-center">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-black p-0.5 shadow-xl ring-2 ring-white/10 group-hover:ring-primary/50 transition-all">
                                                        <div className="w-full h-full rounded-full bg-black/50 flex items-center justify-center overflow-hidden">
                                                            {match.teams.away.logoUrl ? (
                                                                <img src={match.teams.away.logoUrl} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-xs font-black text-white/30">{match.teams.away.name.substring(0, 2)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-tight leading-tight line-clamp-2 h-8 flex items-center">{match.teams.away.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <MatchEditDialog
                match={editingMatch}
                open={!!editingMatch}
                onOpenChange={(open) => !open && setEditingMatch(null)}
                onUpdate={fetchMatches}
            />
        </div>
    );
}
