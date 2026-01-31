"use client";

import { useState } from "react";
import { tournamentService } from "@/lib/services/tournaments";
import { Tournament, MatchDay, Match, Team } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, ArrowRightLeft, CalendarDays } from "lucide-react";
import { teamService } from "@/lib/services/teams";
import { useEffect } from "react";

export function FixtureGenerator({ tournament, onUpdate }: { tournament: Tournament, onUpdate: () => void }) {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        teamService.getActive().then(setTeams);
    }, []);

    const seriesNames = ["A", "B", "C"];
    const matchDays = tournament.matchDays || [];

    const handleAddMatchDay = async (serieName: string) => {
        const existingInSerie = matchDays.filter(md => md.serie === serieName);
        const newOrder = existingInSerie.length + 1;

        const newDay: MatchDay = {
            id: crypto.randomUUID(),
            name: `Fecha ${newOrder}`,
            order: newOrder,
            phaseId: 'fase_grupos',
            serie: serieName,
            matches: [],
            status: 'pending',
            isReturnRound: false
        };

        const updatedMatchDays = [...matchDays, newDay];
        await saveMatchDays(updatedMatchDays);
    };

    const saveMatchDays = async (newMatchDays: MatchDay[]) => {
        if (!tournament.id) return;
        setLoading(true);
        try {
            await tournamentService.updateMatchDays(tournament.id, newMatchDays);
            onUpdate();
        } catch (e) {
            console.error(e);
            alert("Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReturn = async () => {
        if (!tournament.id) return;
        if (!confirm("¿Generar revanchas automáticamente para TODAS las series?")) return;

        // Filtrar solo las de IDA (not isReturnRound)
        const idaDays = matchDays.filter(d => !d.isReturnRound);
        const startOffset = idaDays.length; // Si hay 5 fechas de ida, la vuelta arranca orden 6? No, depende de cada serie.

        // Mejor estrategia: Calcular offset por Serie.
        let newMatchDays = [...matchDays];

        for (const serie of seriesNames) {
            const seriesIda = matchDays.filter(d => d.serie === serie && !d.isReturnRound);
            if (seriesIda.length === 0) continue;

            const maxOrder = Math.max(...matchDays.filter(d => d.serie === serie).map(d => d.order), 0);

            // Generar vuelta para esta serie
            const seriesVuelta = tournamentService.generateReturnMatchDays(seriesIda, maxOrder);
            newMatchDays = [...newMatchDays, ...seriesVuelta];
        }

        await saveMatchDays(newMatchDays);
    };

    return (
        <div className="space-y-6">
            <div className="admin-info-bar">
                <div>
                    <h3 className="text-lg font-semibold">Gestión de Fixture</h3>
                    <p className="text-sm text-muted-foreground">Carga manual de Ida - Automática para Vuelta</p>
                </div>
                <Button onClick={handleGenerateReturn} variant="outline" className="gap-2 text-primary hover:text-primary hover:bg-primary/10">
                    <ArrowRightLeft className="h-4 w-4" /> Generar Revanchas
                </Button>
            </div>

            <Tabs defaultValue="A" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    {seriesNames.map(s => (
                        <TabsTrigger key={s} value={s}>Serie {s}</TabsTrigger>
                    ))}
                </TabsList>

                {seriesNames.map(serieName => {
                    const serieMatchDays = matchDays.filter(md => md.serie === serieName).sort((a, b) => a.order - b.order);
                    const serieTeamsIds = tournament.seriesData?.find(s => s.name === serieName)?.teamIds || [];
                    const serieTeams = teams.filter(t => serieTeamsIds.includes(t.id!));

                    return (
                        <TabsContent key={serieName} value={serieName} className="space-y-4">
                            <div className="flex justify-between items-center mt-4">
                                <h4 className="font-semibold text-primary">Calendario Serie {serieName}</h4>
                                <Button size="sm" onClick={() => handleAddMatchDay(serieName)}>
                                    <Plus className="h-4 w-4 mr-2" /> Nueva Fecha
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {serieMatchDays.length === 0 && (
                                    <div className="admin-empty-state">
                                        No hay fechas creadas para la Serie {serieName}
                                    </div>
                                )}
                                {serieMatchDays.map((md, idx) => (
                                    <MatchDayEditor
                                        key={md.id}
                                        matchDay={md}
                                        availableTeams={serieTeams}
                                        allMatchDays={matchDays} // NEW PROP
                                        onUpdate={(updatedMd) => {

                                            const newDays = matchDays.map(d => d.id === updatedMd.id ? updatedMd : d);
                                            saveMatchDays(newDays);
                                        }}
                                        onDelete={() => {
                                            if (confirm("¿Borrar esta fecha?")) {
                                                const newDays = matchDays.filter(d => d.id !== md.id);
                                                saveMatchDays(newDays);
                                            }
                                        }}
                                        isOddSerie={serieTeams.length % 2 !== 0}
                                    />
                                ))}
                            </div>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
}

function MatchDayEditor({ matchDay, availableTeams, allMatchDays, onUpdate, onDelete, isOddSerie }:
    { matchDay: MatchDay, availableTeams: Team[], allMatchDays: MatchDay[], onUpdate: (m: MatchDay) => void, onDelete: () => void, isOddSerie: boolean }) {

    // 1. Calculate teams that are ALREADY playing in this MatchDay (or are free)
    const getBusyTeamIds = (excludeMatchId?: string) => {
        const busy = new Set<string>();
        if (matchDay.freeTeamId) busy.add(matchDay.freeTeamId);

        matchDay.matches.forEach(m => {
            if (m.id === excludeMatchId) return; // Don't count current match being edited
            if (m.teams.home.id) busy.add(m.teams.home.id);
            if (m.teams.away.id) busy.add(m.teams.away.id);
        });
        return busy;
    };

    // 2. Check if a matchup already exists in PREVIOUS rounds (Ida checks)
    const checkMatchupExists = (teamAId: string, teamBId: string) => {
        if (!teamAId || !teamBId) return false;
        // Check all OTHER match days in the same phase/serie
        for (const day of allMatchDays) {
            if (day.id === matchDay.id) continue;
            // Only care about matches that "happened" or are scheduled in other dates
            for (const m of day.matches) {
                const h = m.teams.home.id;
                const a = m.teams.away.id;
                // Check undirected pair {A,B} == {H,A}
                if ((h === teamAId && a === teamBId) || (h === teamBId && a === teamAId)) {
                    return `Ya jugaron en ${day.name}`;
                }
            }
        }
        return null;
    };

    const addMatch = () => {
        const newMatch: Match = {
            id: crypto.randomUUID(),
            status: 'scheduled',
            teams: {
                home: { id: '', name: '', score: 0 },
                away: { id: '', name: '', score: 0 }
            }
        };
        onUpdate({ ...matchDay, matches: [...matchDay.matches, newMatch] });
    };

    const updateMatch = (matchId: string, updates: Partial<Match>) => {
        const newMatches = matchDay.matches.map(m => {
            if (m.id === matchId) {
                return { ...m, ...updates };
            }
            return m;
        });
        onUpdate({ ...matchDay, matches: newMatches });
    };

    const removeMatch = (matchId: string) => {
        onUpdate({ ...matchDay, matches: matchDay.matches.filter(m => m.id !== matchId) });
    };

    // Helper for Free Team Select (exclude teams playing)
    // For free team select, we exclude ANY team that is currently in a match
    const busyForFree = new Set<string>();
    matchDay.matches.forEach(m => {
        if (m.teams.home.id) busyForFree.add(m.teams.home.id);
        if (m.teams.away.id) busyForFree.add(m.teams.away.id);
    });

    return (
        <Card className="admin-card-accent relative overflow-hidden">
            <CardHeader className="py-3 px-4 bg-muted/10 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <Badge variant={matchDay.isReturnRound ? "secondary" : "default"}>
                        {matchDay.name}
                    </Badge>
                    {isOddSerie && (
                        <div className="flex items-center gap-2 text-sm ml-4">
                            <span className="text-muted-foreground">Libre:</span>
                            <Select
                                value={matchDay.freeTeamId || "none"}
                                onValueChange={(val) => onUpdate({ ...matchDay, freeTeamId: val === "none" ? undefined : val })}
                            >
                                <SelectTrigger className="w-[180px] h-8">
                                    <SelectValue placeholder="Seleccionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">-- Nadie --</SelectItem>
                                    {availableTeams
                                        .filter(t => !busyForFree.has(t.id!) || t.id === matchDay.freeTeamId) // Filter out playing teams
                                        .map(t => (
                                            <SelectItem key={t.id} value={t.id!}>{t.name}</SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
                {matchDay.matches.length === 0 && (
                    <div className="admin-empty-state py-4 cursor-pointer hover:border-primary" onClick={addMatch}>
                        + Click para agregar primer partido
                    </div>
                )}
                {matchDay.matches.map(match => {
                    const busyIds = getBusyTeamIds(match.id);

                    // Logic to find valid opponents for the selected HOME team
                    const homeTeamId = match.teams.home.id;
                    const invalidOpponentsForHome = new Set<string>();

                    if (homeTeamId) {
                        // Find teams that already played against homeTeamId in OTHER valid match days
                        // (Exclude return rounds if we are in Ida, though logic should hold generally for 'phases')
                        allMatchDays.forEach(d => {
                            if (d.id === matchDay.id) return; // Don't check current day
                            if (d.isReturnRound === matchDay.isReturnRound) { // Only check same phase (Ida vs Ida)
                                d.matches.forEach(m => {
                                    const h = m.teams.home.id;
                                    const a = m.teams.away.id;
                                    if (h === homeTeamId) invalidOpponentsForHome.add(a);
                                    if (a === homeTeamId) invalidOpponentsForHome.add(h);
                                });
                            }
                        });
                    }

                    return (
                        <div key={match.id} className="admin-match-row">
                            <div className="flex flex-col md:flex-row items-center gap-2">
                                {/* LOCAL */}
                                <div className="flex-1 w-full">
                                    <Select
                                        value={match.teams.home.id}
                                        onValueChange={(val) => {
                                            const t = availableTeams.find(x => x.id === val);
                                            // Reset Away team if it becomes invalid? checking logic later
                                            updateMatch(match.id!, {
                                                teams: {
                                                    ...match.teams,
                                                    home: { ...match.teams.home, id: val, name: t?.name || '' },
                                                    // Optional: Clear away if now invalid? Let's keep it manual to avoid annoyance
                                                }
                                            });
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Local" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableTeams
                                                .filter(t =>
                                                    !busyIds.has(t.id!) && // Not playing this week
                                                    t.id !== match.teams.away.id // Not self (as opponent)
                                                    || t.id === match.teams.home.id // Current selection
                                                )
                                                .map(t => (
                                                    <SelectItem key={t.id} value={t.id!}>{t.name}</SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <span className="font-bold text-muted-foreground">VS</span>

                                {/* VISITANTE */}
                                <div className="flex-1 w-full">
                                    <Select
                                        value={match.teams.away.id}
                                        onValueChange={(val) => {
                                            const t = availableTeams.find(x => x.id === val);
                                            updateMatch(match.id!, {
                                                teams: { ...match.teams, away: { ...match.teams.away, id: val, name: t?.name || '' } }
                                            });
                                        }}
                                        disabled={!match.teams.home.id} // Disable until Home is picked
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Visitante" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableTeams
                                                .filter(t =>
                                                    !busyIds.has(t.id!) && // Not playing this week
                                                    t.id !== match.teams.home.id && // Not self
                                                    !invalidOpponentsForHome.has(t.id!) // HAS NOT PLAYED AGAINST HOME YET
                                                    || t.id === match.teams.away.id // Current selection
                                                )
                                                .map(t => (
                                                    <SelectItem key={t.id} value={t.id!}>{t.name}</SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* DELETE MATCH */}
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeMatch(match.id!)}>
                                    <XComp />
                                </Button>
                            </div>
                        </div>
                    );
                })}

                <Button variant="outline" size="sm" className="w-full mt-2 border-dashed" onClick={addMatch}>
                    <Plus className="h-4 w-4 mr-2" /> Agregar Partido
                </Button>
            </CardContent>
        </Card>
    );
}

function XComp() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    )
}
