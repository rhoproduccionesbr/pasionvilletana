"use client";

import { useEffect, useState } from "react";
import { teamService } from "@/lib/services/teams";
import { Team } from "@/types";
import { TeamForm } from "@/components/forms/TeamForm";
import { SeedTeamsButton } from "@/components/admin/SeedTeamsButton";
import { LogoAutoSeeder } from "@/components/admin/LogoAutoSeeder";
import { Users, MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminTeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const data = await teamService.getAll();
            setTeams(data);
        } catch (error) {
            console.error("Failed to fetch teams", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este equipo? Esta acción no se puede deshacer.")) return;
        try {
            await teamService.delete(id);
            // Optimistic update
            setTeams(teams.filter(t => t.id !== id));
        } catch (error) {
            console.error("Failed to delete team", error);
            alert("Error al eliminar equipo");
            fetchTeams(); // Rollback if error
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Equipos</h1>
                    <p className="text-muted-foreground">Administra los clubes participantes</p>
                </div>
                <SeedTeamsButton />
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-1 space-y-4">
                    <TeamForm
                        initialData={editingTeam}
                        onSuccess={() => {
                            fetchTeams();
                            setEditingTeam(null);
                        }}
                        onCancel={editingTeam ? () => setEditingTeam(null) : undefined}
                    />

                    {/* Dev Tool: Auto Logo Seeder */}
                    <div className="border border-dashed border-yellow-500/50 p-4 rounded-xl bg-yellow-500/5">
                        <h4 className="text-sm font-semibold text-yellow-600 mb-2">Herramientas de Desarrollo</h4>
                        <LogoAutoSeeder />
                    </div>
                </div>

                {/* List Column */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Clubes Registrados
                    </h3>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                            ))}
                        </div>
                    ) : teams.length === 0 ? (
                        <div className="p-8 border rounded-lg text-center text-muted-foreground bg-muted/20 border-dashed">
                            No hay equipos registrados aún.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {teams.map((team) => (
                                <div key={team.id} className="group relative flex items-center gap-4 p-4 border rounded-xl bg-card hover:shadow-md transition-all">
                                    {/* Logo Placeholder or Image */}
                                    <div
                                        className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold border shadow-sm"
                                        style={{
                                            background: team.logoUrl ? `url(${team.logoUrl})` : `linear-gradient(135deg, ${team.colors?.primary || '#333'} 50%, ${team.colors?.secondary || '#666'} 50%)`,
                                            backgroundSize: 'cover'
                                        }}
                                    >
                                        {!team.logoUrl && team.shortName?.substring(0, 2)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold truncate">{team.name}</h4>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="h-3 w-3" />
                                            <span className="truncate">{team.location || "Sin sede definida"}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500" onClick={() => setEditingTeam(team)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => team.id && handleDelete(team.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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
