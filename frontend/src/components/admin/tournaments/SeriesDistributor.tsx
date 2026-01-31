"use client";

import { useState, useEffect } from "react";
import { tournamentService } from "@/lib/services/tournaments";
import { teamService } from "@/lib/services/teams";
import { Tournament, Team, TournamentSeries } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, AlertCircle, Save } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface SeriesDistributorProps {
    tournament: Tournament;
    onUpdate: () => void;
}

export function SeriesDistributor({ tournament, onUpdate }: SeriesDistributorProps) {
    const [loading, setLoading] = useState(false);
    const [teams, setTeams] = useState<Team[]>([]);

    // State local para las series
    // Inicializar si existe, sino estructura default
    const [series, setSeries] = useState<TournamentSeries[]>(
        tournament.seriesData || [
            { name: "A", teamIds: [] },
            { name: "B", teamIds: [] },
            { name: "C", teamIds: [] }
        ]
    );

    // Cargar equipos participantes
    useEffect(() => {
        const fetchTeams = async () => {
            if (!tournament.participatingTeamIds || tournament.participatingTeamIds.length === 0) {
                setTeams([]);
                return;
            }
            // Idealmente existiria teamService.getByIds, por ahora traemos todos y filtramos
            // Ojo: Performance, pero son pocos equipos (<100)
            const all = await teamService.getActive();
            const participants = all.filter(t => tournament.participatingTeamIds?.includes(t.id!));
            setTeams(participants);
        };
        fetchTeams();
    }, [tournament.participatingTeamIds]);

    const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || "Desconocido";
    const getTeamShort = (id: string) => teams.find(t => t.id === id)?.shortName || "???";

    // Equipos no asignados a ninguna serie
    const getUnassignedTeams = () => {
        const assignedIds = new Set(series.flatMap(s => s.teamIds));
        return teams.filter(t => t.id && !assignedIds.has(t.id));
    };

    const addToSerie = (serieName: string, teamIdsToAdd: string[]) => {
        setSeries(prev => prev.map(s => {
            if (s.name === serieName) {
                return { ...s, teamIds: [...s.teamIds, ...teamIdsToAdd] };
            }
            return s;
        }));
    };

    const removeFromSerie = (serieName: string, teamId: string) => {
        setSeries(prev => prev.map(s => {
            if (s.name === serieName) {
                return { ...s, teamIds: s.teamIds.filter(id => id !== teamId) };
            }
            return s;
        }));
    };

    const handleSave = async () => {
        if (!tournament.id) return;

        // Validación Flexible: Solo advertir si hay menos de 19 equipos asignados en total
        const totalAssigned = series.reduce((acc, s) => acc + s.teamIds.length, 0);
        if (totalAssigned < 19 && teams.length >= 19) {
            if (!confirm(`Solo has asignado ${totalAssigned} de los 19 equipos. ¿Guardar de todos modos?`)) return;
        }

        setLoading(true);
        try {
            await tournamentService.updateSeries(tournament.id, series);
            onUpdate();
        } catch (error) {
            console.error(error);
            alert("Error al guardar series");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold">Distribución de Series</h2>
                    <p className="text-sm text-muted-foreground">
                        {teams.length} equipos clasificados. {getUnassignedTeams().length} pendientes.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={loading} className="gap-2">
                    <Save className="h-4 w-4" />
                    {loading ? "Guardando..." : "Guardar Distribución"}
                </Button>
            </div>

            {/* Grid de Series */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {series.map((serie) => {
                    const maxTeams = 7; // Ahora todas pueden tener hasta 7
                    const count = serie.teamIds.length;
                    const isFull = count >= maxTeams;

                    // Highlight si esta serie tiene 7 (la "impar")
                    const isTheOddOne = count === 7;

                    return (
                        <Card key={serie.name} className={`border-l-4 ${isTheOddOne ? 'border-l-yellow-500 bg-yellow-500/5' : 'border-l-blue-500 bg-card/50'}`}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg">Serie {serie.name}</CardTitle>
                                <Badge variant={count > maxTeams ? "destructive" : (isFull ? "default" : "secondary")}>
                                    {count} / {maxTeams}
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2 min-h-[200px]">
                                    {serie.teamIds.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm py-8 border-2 border-dashed rounded-lg opacity-50">
                                            <span>Serie Vacía</span>
                                        </div>
                                    )}
                                    {serie.teamIds.map(teamId => (
                                        <div key={teamId} className="flex items-center justify-between p-2 rounded-md bg-muted/20 border group">
                                            <span className="font-medium text-sm">{getTeamName(teamId)}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeFromSerie(serie.name, teamId)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <TeamSelectorDialog
                                    availableTeams={getUnassignedTeams()}
                                    onSelect={(ids) => addToSerie(serie.name, ids)}
                                    disabled={isFull && false} // Permitimos sobrepasar por si acaso, pero visualmente warn
                                />
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {getUnassignedTeams().length > 0 && (
                <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <div>
                        <p className="text-sm font-medium text-yellow-500">Hay equipos sin asignar</p>
                        <p className="text-xs text-muted-foreground">Asegúrate de distribuir los {getUnassignedTeams().length} equipos restantes.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function TeamSelectorDialog({ availableTeams, onSelect, disabled }: { availableTeams: Team[], onSelect: (ids: string[]) => void, disabled: boolean }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const handleConfirm = () => {
        onSelect(Array.from(selected));
        setSelected(new Set());
        setOpen(false);
    };

    const toggle = (id: string) => {
        const s = new Set(selected);
        s.has(id) ? s.delete(id) : s.add(id);
        setSelected(s);
    };

    if (disabled) return <Button variant="outline" className="w-full opacity-50 cursor-not-allowed">Serie Llena</Button>;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-dashed hover:border-primary hover:bg-primary/5">
                    <Plus className="h-4 w-4 mr-2" /> Agregar Equipo
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Seleccionar Equipos</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto p-1 space-y-2 my-2">
                    {availableTeams.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No hay más equipos disponibles.</p>
                    ) : (
                        availableTeams.map(t => (
                            <div key={t.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded" onClick={() => t.id && toggle(t.id)}>
                                <Checkbox checked={selected.has(t.id!)} />
                                <span className="text-sm">{t.name}</span>
                            </div>
                        ))
                    )}
                </div>
                <Button onClick={handleConfirm} disabled={selected.size === 0}>
                    Agregar {selected.size} Equipos
                </Button>
            </DialogContent>
        </Dialog>
    );
}
