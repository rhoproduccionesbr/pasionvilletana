"use client";

import { useState, useEffect } from "react";
import { teamService } from "@/lib/services/teams";
import { tournamentService } from "@/lib/services/tournaments";
import { Team, Tournament } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function ParticipatingTeamsSelector({ tournament, onUpdate }: { tournament: Tournament, onUpdate: () => void }) {
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(tournament.participatingTeamIds || []));
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        teamService.getActive().then(setAllTeams);
    }, []);

    const toggleTeam = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const handleSave = async () => {
        if (!tournament.id) return;
        setLoading(true);
        try {
            await tournamentService.update(tournament.id, {
                participatingTeamIds: Array.from(selectedIds)
            });
            alert("Participantes actualizados");
            onUpdate();
        } catch (error) {
            console.error(error);
            alert("Error al actualizar");
        } finally {
            setLoading(false);
        }
    };

    const filteredTeams = allTeams.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.shortName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar equipos..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {selectedIds.size} seleccionados
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto p-2 border rounded-md bg-muted/10">
                {filteredTeams.map(team => (
                    <div
                        key={team.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedIds.has(team.id!) ? 'bg-primary/10 border-primary shadow-sm' : 'bg-card hover:bg-muted'}`}
                        onClick={() => team.id && toggleTeam(team.id)}
                    >
                        <Checkbox checked={selectedIds.has(team.id!)} />
                        <div className="flex items-center gap-2 overflow-hidden">
                            {team.logoUrl && (
                                <img src={team.logoUrl} alt={team.shortName} className="w-6 h-6 object-contain" />
                            )}
                            <span className="text-sm font-medium truncate">{team.name} ({team.shortName})</span>
                        </div>
                    </div>
                ))}
            </div>

            <Button onClick={handleSave} disabled={loading} className="w-full md:w-auto">
                {loading ? "Guardando..." : "Guardar Participantes"}
            </Button>
        </div>
    );
}
