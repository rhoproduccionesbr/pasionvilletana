"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // New component
import { teamService } from "@/lib/services/teams";
import { Team } from "@/types";
import { storage } from "@/lib/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Upload, X } from "lucide-react";

export function TeamForm({ onSuccess, initialData, onCancel }: { onSuccess: () => void, initialData?: Team | null, onCancel?: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const { register, handleSubmit, reset, watch, setValue } = useForm<Omit<Team, "id">>();

    // Watch colors for preview
    const primaryColor = watch("colors.primary", "#ef4444");
    const secondaryColor = watch("colors.secondary", "#000000");
    const currentLogoUrl = watch("logoUrl");

    // Reset form when initialData changes
    useEffect(() => {
        if (initialData) {
            setValue("name", initialData.name);
            setValue("shortName", initialData.shortName);
            setValue("location", initialData.location || "");
            setValue("stadium", initialData.stadium || "");
            setValue("colors", initialData.colors || { primary: "#ef4444", secondary: "#000000" });
            setValue("logoUrl", initialData.logoUrl || "");
            setValue("history", initialData.history || "");
            setValue("socials", initialData.socials || {});
        } else {
            reset({
                name: "", shortName: "", location: "", stadium: "",
                colors: { primary: "#ef4444", secondary: "#000000" }, logoUrl: "", history: "", socials: {}
            });
        }
    }, [initialData, setValue, reset]);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingLogo(true);
        try {
            // Storage path: lvf_logos/{timestamp}_{filename}
            const storageRef = ref(storage, `lvf_logos/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(snapshot.ref);

            setValue("logoUrl", downloadUrl);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Error al subir imagen");
        } finally {
            setUploadingLogo(false);
        }
    };

    const onSubmit = async (data: Omit<Team, "id">) => {
        setIsLoading(true);
        try {
            if (initialData && initialData.id) {
                await teamService.update(initialData.id, data);
            } else {
                await teamService.create(data);
            }
            reset();
            onSuccess();
        } catch (error) {
            console.error("Error saving team:", error);
            alert("Error al guardar equipo");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 border p-6 rounded-xl bg-card/60 backdrop-blur-md shadow-lg relative animate-in fade-in slide-in-from-right-4 duration-500">
            {onCancel && (
                <button type="button" onClick={onCancel} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                </button>
            )}
            <div>
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                    {initialData ? "Editar Equipo" : "Nuevo Equipo"}
                </h3>
                <p className="text-sm text-muted-foreground">{initialData ? "Actualiza la información del club" : "Registra un nuevo club en la liga"}</p>
            </div>

            <div className="space-y-4">
                {/* Basic Info */}
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre Oficial</Label>
                    <Input id="name" placeholder="Ej: Club 12 de Octubre" {...register("name", { required: true })} className="bg-background/40" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="shortName">Siglas / Corto</Label>
                        <Input id="shortName" placeholder="Ej: 12 Oct" {...register("shortName", { required: true })} className="bg-background/40" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="foundedDate">Fundación (Opc.)</Label>
                        <Input type="date" id="foundedDate" {...register("foundedDate")} className="bg-background/40" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="location">Sede / Barrio</Label>
                        <Input id="location" placeholder="Ej: Naranjaisy" {...register("location")} className="bg-background/40" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stadium">Estadio</Label>
                        <Input id="stadium" placeholder="Ej: Pa'i Beni" {...register("stadium")} className="bg-background/40" />
                    </div>
                </div>

                {/* Visual Identity */}
                <div className="p-4 rounded-lg bg-muted/20 space-y-4 border border-border/50">
                    <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Identidad Visual</Label>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="primaryColor">Color 1 (Camiseta)</Label>
                            <div className="flex gap-2 items-center">
                                <div className="relative w-full">
                                    <Input
                                        type="color"
                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                        id="primaryColor"
                                        {...register("colors.primary")}
                                        defaultValue="#ef4444"
                                    />
                                    <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-background/50">
                                        <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: primaryColor }}></div>
                                        <span className="text-xs font-mono">{primaryColor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="secondaryColor">Color 2 (Alternativo)</Label>
                            <div className="flex gap-2 items-center">
                                <div className="relative w-full">
                                    <Input
                                        type="color"
                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                        id="secondaryColor"
                                        {...register("colors.secondary")}
                                        defaultValue="#000000"
                                    />
                                    <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-background/50">
                                        <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: secondaryColor }}></div>
                                        <span className="text-xs font-mono">{secondaryColor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Escudo del Club</Label>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white ring-2 ring-black/5 overflow-hidden bg-zinc-900"
                                style={{
                                    background: currentLogoUrl ? `url(${currentLogoUrl})` : `linear-gradient(135deg, ${primaryColor} 50%, ${secondaryColor} 50%)`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {!currentLogoUrl && "VS"}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    disabled={uploadingLogo}
                                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                                {uploadingLogo && <p className="text-xs text-blue-500 animate-pulse">Subiendo escudo...</p>}
                            </div>
                        </div>
                        <Input type="hidden" {...register("logoUrl")} />
                    </div>
                </div>

                {/* Detailed Info */}
                <div className="space-y-2">
                    <Label htmlFor="history">Historia / Reseña</Label>
                    <Textarea
                        id="history"
                        placeholder="Escribe una breve reseña histórica del club, logros, apodos, etc."
                        className="min-h-[100px] bg-background/40"
                        {...register("history")}
                    />
                </div>
            </div>

            <div className="flex gap-2 pt-4">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} className="w-full">
                        Cancelar
                    </Button>
                )}
                <Button type="submit" disabled={isLoading || uploadingLogo} className="w-full font-bold shadow-lg shadow-primary/20">
                    {isLoading ? "Guardando..." : (initialData ? "Actualizar Club" : "Registrar Club")}
                </Button>
            </div>
        </form>
    );
}
