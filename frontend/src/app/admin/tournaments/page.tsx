"use client";

import { useEffect, useState } from "react";
import { tournamentService } from "@/lib/services/tournaments";
import { Tournament } from "@/types";
import { TournamentForm } from "@/components/forms/TournamentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar, Trophy, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminTournamentsPage() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);

    const fetchTournaments = async () => {
        setLoading(true);
        try {
            const data = await tournamentService.getAll();
            setTournaments(data);
        } catch (error) {
            console.error("Failed to fetch tournaments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este torneo?")) return;
        try {
            await tournamentService.delete(id);
            setTournaments(tournaments.filter(t => t.id !== id));
        } catch (error) {
            console.error(error);
            alert("Error al eliminar");
        }
    };

    useEffect(() => {
        fetchTournaments();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Torneos</h1>
                    <p className="text-muted-foreground">Administra campeonatos y temporadas</p>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <TournamentForm
                        initialData={editingTournament}
                        onSuccess={() => {
                            fetchTournaments();
                            setEditingTournament(null);
                        }}
                        onCancel={editingTournament ? () => setEditingTournament(null) : undefined}
                    />
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Torneos Existentes
                    </h3>

                    {loading ? (
                        <p className="text-muted-foreground">Cargando...</p>
                    ) : tournaments.length === 0 ? (
                        <div className="p-8 border rounded-lg text-center text-muted-foreground bg-muted/20 border-dashed">
                            No hay torneos registrados.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {tournaments.map((t) => (
                                <div key={t.id} className="group relative flex items-center justify-between p-4 border rounded-lg bg-card/50 backdrop-blur-sm hover:shadow-md transition-all">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">
                                                {t.season}
                                            </span>
                                            <h4 className="font-semibold text-lg">{t.name}</h4>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            {t.honorName && <span>"{t.honorName}"</span>}
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${t.status === 'active' ? 'bg-green-500/10 text-green-600' :
                                                t.status === 'finished' ? 'bg-gray-500/10 text-gray-600' :
                                                    'bg-blue-500/10 text-blue-600'
                                                }`}>
                                                {t.status === 'planned' ? 'Planificado' : t.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500" onClick={() => setEditingTournament(t)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => t.id && handleDelete(t.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/admin/tournaments/${t.id}`}>
                                            <Button size="sm" className="gap-2">
                                                <Settings className="h-4 w-4" />
                                                Gestionar
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
