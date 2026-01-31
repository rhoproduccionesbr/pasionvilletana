"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { tournamentService } from "@/lib/services/tournaments";
import { Tournament } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function TournamentRulesForm({ tournament, onUpdate }: { tournament: Tournament, onUpdate: () => void }) {
    const [loading, setLoading] = useState(false);

    // We bind directly to the config object structure
    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            categories: tournament.categories || [],
            format: tournament.config?.format || 'groups_to_playoff',
            series: tournament.config?.groupsConfig?.series?.join(",") || "A,B,C",
            qualifiersPerGroup: tournament.config?.playoffConfig?.qualifiersPerGroup || 0, // 0 means variable
            totalQualifiers: tournament.config?.playoffConfig?.totalQualifiers || 16,
        }
    });

    // Helper to handle category checkboxes
    const categories = watch("categories");
    const toggleCategory = (cat: 'primera' | 'juvenil') => {
        const current = categories || [];
        if (current.includes(cat)) {
            setValue("categories", current.filter(c => c !== cat));
        } else {
            setValue("categories", [...current, cat]);
        }
    };

    const onSubmit = async (data: any) => {
        if (!tournament.id) return;
        setLoading(true);
        try {
            // Transform series string "A,B,C" -> ["A", "B", "C"]
            const seriesArray = data.series.split(",").map((s: string) => s.trim()).filter(Boolean);

            await tournamentService.update(tournament.id, {
                categories: data.categories,
                config: {
                    matchDuration: tournament.config?.matchDuration || 90,
                    maxPlayersPerTeam: tournament.config?.maxPlayersPerTeam || 25,
                    pointsForWin: tournament.config?.pointsForWin || 3,
                    pointsForDraw: tournament.config?.pointsForDraw || 1,
                    pointsForLoss: tournament.config?.pointsForLoss || 0,
                    format: data.format,
                    groupsConfig: {
                        series: seriesArray
                    },
                    playoffConfig: {
                        totalQualifiers: parseInt(data.totalQualifiers),
                        qualifiersPerGroup: parseInt(data.qualifiersPerGroup)
                    }
                }
            });
            alert("Reglamento guardado correctamente");
            onUpdate();
        } catch (error) {
            console.error(error);
            alert("Error al guardar reglas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 border p-4 rounded-lg bg-card/50">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Categorías Habilitadas</h4>
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="primera"
                            checked={categories?.includes('primera')}
                            onCheckedChange={() => toggleCategory('primera')}
                        />
                        <Label htmlFor="primera" className="cursor-pointer">Primera División</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="juvenil"
                            checked={categories?.includes('juvenil')}
                            onCheckedChange={() => toggleCategory('juvenil')}
                        />
                        <Label htmlFor="juvenil" className="cursor-pointer">Juvenil</Label>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="format">Formato de Competición</Label>
                    <select
                        {...register("format")}
                        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="groups_to_playoff">Fase de Grupos + Eliminatoria</option>
                        <option value="league">Liga (Todos contra todos)</option>
                        <option value="elimination">Eliminación Directa (Copa)</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="series">Series (Separadas por comas)</Label>
                    <Input id="series" {...register("series")} placeholder="A, B, C" />
                    <p className="text-xs text-muted-foreground">Define los grupos disponibles.</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="totalQualifiers">Total Clasificados (Fase Final)</Label>
                    <Input type="number" id="totalQualifiers" {...register("totalQualifiers")} />
                    <p className="text-xs text-muted-foreground">Ej: 16 para iniciar en Octavos de Final.</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="qualifiersPerGroup">Clasificados por Grupo (Opcional)</Label>
                    <Input type="number" id="qualifiersPerGroup" {...register("qualifiersPerGroup")} />
                    <p className="text-xs text-muted-foreground">0 = Variable (como A:6, B:5, C:5).</p>
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Guardando..." : "Guardar Configuración"}
            </Button>
        </form>
    );
}
