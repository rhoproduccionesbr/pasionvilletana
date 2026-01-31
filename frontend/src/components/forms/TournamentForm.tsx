"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tournamentService } from "@/lib/services/tournaments";
import { Tournament } from "@/types";

export function TournamentForm({ onSuccess, initialData, onCancel }: { onSuccess: () => void, initialData?: Tournament | null, onCancel?: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, setValue } = useForm<Omit<Tournament, "id">>();

    useEffect(() => {
        if (initialData) {
            setValue("name", initialData.name);
            setValue("season", initialData.season);
            setValue("status", initialData.status);
            setValue("honorName", initialData.honorName || "");
        } else {
            reset({
                name: "", season: new Date().getFullYear().toString(), status: "planned", honorName: ""
            });
        }
    }, [initialData, setValue, reset]);

    const onSubmit = async (data: Omit<Tournament, "id">) => {
        setIsLoading(true);
        try {
            if (initialData && initialData.id) {
                await tournamentService.update(initialData.id, data);
            } else {
                await tournamentService.create(data);
            }
            reset();
            onSuccess();
        } catch (error) {
            console.error("Error creating tournament:", error);
            alert("Error al guardar torneo");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-6 rounded-xl bg-card/50 backdrop-blur-sm shadow-sm relative">
            {onCancel && (
                <button type="button" onClick={onCancel} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
                    ✕
                </button>
            )}
            <div>
                <h3 className="text-lg font-semibold">{initialData ? "Editar Torneo" : "Nuevo Torneo"}</h3>
                <p className="text-sm text-muted-foreground">{initialData ? "Modifica los detalles" : "Crear una nueva competición"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="season">Temporada</Label>
                    <Input id="season" placeholder="2025" {...register("season", { required: true })} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...register("status")}
                    >
                        <option value="planned">Planificado</option>
                        <option value="active">En Curso</option>
                        <option value="finished">Finalizado</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Nombre del Torneo</Label>
                <Input id="name" placeholder="Ej: Súper Liga Villetana" {...register("name", { required: true })} className="bg-background/50" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="honorName">Nombre Homenaje (Opcional)</Label>
                <Input id="honorName" placeholder="Homenaje a Don..." {...register("honorName")} className="bg-background/50" />
            </div>

            <div className="flex gap-2 pt-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} className="w-full">
                        Cancelar
                    </Button>
                )}
                <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-primary/80">
                    {isLoading ? "Guardando..." : (initialData ? "Actualizar" : "Crear Torneo")}
                </Button>
            </div>
        </form>
    );
}
