"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { tournamentService } from "@/lib/services/tournaments";
import { Tournament } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParticipatingTeamsSelector } from "@/components/admin/tournaments/ParticipatingTeamsSelector";
import { SeriesDistributor } from "@/components/admin/tournaments/SeriesDistributor";
import { TournamentRulesForm } from "@/components/admin/tournaments/TournamentRulesForm";
import { FixtureGenerator } from "@/components/admin/tournaments/FixtureGenerator";
import { MatchList } from "@/components/admin/tournaments/MatchList";
import { Users, BookOpen, Calculator, Layers } from "lucide-react";

export default function TournamentDetailsPage() {
    const params = useParams();
    const id = params?.id as string;
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchTournament = async () => {
        if (!id) return;
        try {
            // We'll need a getById method in service
            // For now assuming getAll and find, but ideally getDoc
            const all = await tournamentService.getAll();
            const found = all.find(t => t.id === id);
            setTournament(found || null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTournament();
    }, [id]);

    const [lastUpdated, setLastUpdated] = useState(Date.now()); // Force refresh for child components

    const handleDataUpdate = () => {
        fetchTournament();
        setLastUpdated(Date.now());
    };

    if (loading) return <div>Cargando torneo...</div>;
    if (!tournament) return <div>Torneo no encontrado</div>;

    return (
        <div className="space-y-6 animate-in fade-in">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 bg-primary/10 text-primary rounded border border-primary/20">
                            {tournament.season}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase">{tournament.status}</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{tournament.name}</h1>
                    {tournament.honorName && <p className="text-muted-foreground">"{tournament.honorName}"</p>}
                </div>
            </header>

            <Tabs defaultValue="participants" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="series" className="flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Series
                    </TabsTrigger>
                    <TabsTrigger value="participants" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Participantes
                    </TabsTrigger>
                    <TabsTrigger value="rules" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Reglamento
                    </TabsTrigger>
                    <TabsTrigger value="fixture" className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Fixture
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="series" className="space-y-4">
                    <SeriesDistributor
                        tournament={tournament}
                        onUpdate={handleDataUpdate}
                    />
                </TabsContent>

                <TabsContent value="participants" className="space-y-4">
                    <Card className="admin-card">
                        <CardHeader>
                            <CardTitle>Clubes Participantes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ParticipatingTeamsSelector
                                tournament={tournament}
                                onUpdate={handleDataUpdate}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rules" className="space-y-4">
                    <Card className="admin-card">
                        <CardHeader>
                            <CardTitle>Configuración del Torneo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TournamentRulesForm
                                tournament={tournament}
                                onUpdate={handleDataUpdate}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="fixture" className="space-y-4">
                    <Card className="admin-card">
                        <CardHeader>
                            <CardTitle>Fixture y Partidos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FixtureGenerator
                                tournament={tournament}
                                onUpdate={handleDataUpdate}
                            />

                            <div className="pt-6 border-t">
                                <h3 className="admin-section-title mb-4">Calendario de Partidos</h3>
                                <MatchList tournament={tournament} key={lastUpdated} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
