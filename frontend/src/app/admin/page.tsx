"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Shield, Users, Activity } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Torneos Activos</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">+1 planificado</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clubes Registrados</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Inscripciones abiertas</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jugadores</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Pendiente de carga</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Actividad</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Sistema</div>
                        <p className="text-xs text-muted-foreground">Operativo y Online</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity / Validation Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Estado del Sistema</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-2 text-green-600">
                                <div className="h-2 w-2 rounded-full bg-green-600" />
                                Base de Datos: <strong>Conectada (lvfvilleta)</strong>
                            </div>
                            <div className="flex items-center gap-2 text-green-600">
                                <div className="h-2 w-2 rounded-full bg-green-600" />
                                Storage: <strong>Listo (lvfbase)</strong>
                            </div>
                            <div className="flex items-center gap-2 text-blue-600">
                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                                Modo: <strong>Desarrollo Mobile-First</strong>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
