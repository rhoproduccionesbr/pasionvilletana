"use client";

import { useEffect, useState } from "react";
import { Match } from "@/types";
import { matchService } from "@/lib/services/matches";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface MatchEditDialogProps {
    match: Match | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: () => void;
}

export function MatchEditDialog({ match, open, onOpenChange, onUpdate }: MatchEditDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [status, setStatus] = useState<'scheduled' | 'finished'>('scheduled');

    useEffect(() => {
        if (match) {
            setHomeScore(match.teams.home.score || 0);
            setAwayScore(match.teams.away.score || 0);
            setStatus(match.status);

            if (match.date) {
                const d = new Date(match.date);
                setDate(format(d, "yyyy-MM-dd"));
                setTime(format(d, "HH:mm"));
            }
        }
    }, [match]);

    const handleSave = async () => {
        if (!match) return;
        setIsLoading(true);
        try {
            // Reconstruct Date
            let newDateIso = match.date;
            if (date && time) {
                newDateIso = new Date(`${date}T${time}`).toISOString();
            }

            await matchService.update(match.id, {
                status: status,
                date: newDateIso,
                teams: {
                    home: { ...match.teams.home, score: homeScore },
                    away: { ...match.teams.away, score: awayScore }
                }
            });

            onUpdate();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            alert("Error al actualizar partido");
        } finally {
            setIsLoading(false);
        }
    };

    if (!match) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Partido</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Schedule */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Fecha</Label>
                            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Hora</Label>
                            <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
                        </div>
                    </div>

                    {/* Scoreboard */}
                    <div className="flex items-center justify-between gap-4 py-4 border-y">
                        <div className="text-center w-1/3">
                            <Label className="block mb-2 text-xs truncate" title={match.teams.home.name}>{match.teams.home.name}</Label>
                            <Input
                                type="number"
                                className="text-center text-2xl font-bold h-12"
                                value={homeScore}
                                onChange={e => setHomeScore(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <span className="text-2xl font-black text-muted-foreground">-</span>
                        <div className="text-center w-1/3">
                            <Label className="block mb-2 text-xs truncate" title={match.teams.away.name}>{match.teams.away.name}</Label>
                            <Input
                                type="number"
                                className="text-center text-2xl font-bold h-12"
                                value={awayScore}
                                onChange={e => setAwayScore(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-2">
                        <Button
                            type="button"
                            variant={status === 'finished' ? "default" : "outline"}
                            onClick={() => setStatus('finished')}
                            className={status === 'finished' ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                            Marcar FINALIZADO
                        </Button>
                        {status === 'finished' && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => setStatus('scheduled')}
                            >
                                Reabrir
                            </Button>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Cambios
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
