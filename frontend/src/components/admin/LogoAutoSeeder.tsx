"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { teamService } from "@/lib/services/teams";
import { storage } from "@/lib/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Team } from "@/types";
import ColorThief from "colorthief";

// Mapping: Team Name in DB -> Filename in public/temp_logos
const LOGO_MAPPING: Record<string, string> = {
    "12 de Octubre": "12 de OCTUBRE_081559.png",
    "2 de Mayo": "2 de Mayo Villeta _081557.png",
    "8 de Diciembre": "8 de DICIEMBRE_081601.png",
    "Cerro León": "Cerro León_.png",
    "Ita Ybate": "Ita YBATE_081553.png",
    "Lomas Valentina": "Loma Valentina.png",
    "Universo": "Universo_081551.png",
    "13 de Mayo": "13 de Mayo.png",
    "1ro de Marzo": "1Ro de Marzo_081550.png",
    "1ro de Mayo": "", // MISSING FILE?
    "22 de Mayo": "22 de Mayo FBC 2020_081558.png",
    "3 de Febrero": "3 de febrero.png",
    "Mariscal E.": "Mariscal Estigarribia_.png",
    "3 de Noviembre": "3 de Noviembre_.png",
    "4 de Octubre": "4 de Octubre.png",
    "FBC Cumbariteño": "Cumbariteño FBC.png",
    "Hijos de Mayo": "Hijos de Mayo Villeta _081547.png",
    "Libertad": "Libertad_.png",
    "Villetano": "Sportivo Villetano.png"
};

export function LogoAutoSeeder() {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

    const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');

    const processLogos = async () => {
        if (!confirm("Esto procesará los logos de public/temp_logos. ¿Continuar?")) return;
        setLoading(true);
        setLogs([]);

        try {
            const teams = await teamService.getAll();
            const colorThief = new ColorThief();

            for (const team of teams) {
                const filename = LOGO_MAPPING[team.name];
                if (!filename) {
                    addLog(`⚠️ Saltando ${team.name}: No hay archivo mapeado.`);
                    continue;
                }

                addLog(`🔄 Procesando ${team.name} (${filename})...`);

                // 1. Fetch Image Blob
                const response = await fetch(`/temp_logos/${filename}`);
                if (!response.ok) {
                    addLog(`❌ Error cargando imagen para ${team.name}`);
                    continue;
                }
                const blob = await response.blob();

                // 2. Upload to Firebase Storage
                const storageRef = ref(storage, `lvf_logos/auto_${Date.now()}_${filename}`);
                const snapshot = await uploadBytes(storageRef, blob);
                const downloadUrl = await getDownloadURL(snapshot.ref);
                addLog(`   ✅ Subido a Storage`);

                // 3. Extract Colors
                // Need to create an Image element for ColorThief
                const img = new Image();
                img.crossOrigin = "Anonymous";
                const imgPromise = new Promise<{ primary: string, secondary: string }>((resolve, reject) => {
                    img.onload = () => {
                        try {
                            const palette = colorThief.getPalette(img, 3);
                            const p = palette[0];
                            const s = palette[1];
                            resolve({
                                primary: rgbToHex(p[0], p[1], p[2]),
                                secondary: rgbToHex(s[0], s[1], s[2])
                            });
                        } catch (e) {
                            reject(e);
                        }
                    };
                    img.onerror = reject;
                });

                // Ensure blob is loaded into img
                img.src = URL.createObjectURL(blob);

                try {
                    const colors = await imgPromise;
                    addLog(`   🎨 Colores detectados: ${colors.primary}, ${colors.secondary}`);

                    // 4. Update Team Doc
                    if (team.id) {
                        await teamService.update(team.id, {
                            logoUrl: downloadUrl,
                            colors: colors
                        });
                        addLog(`   ✨ Equipo actualizado con éxito.`);
                    }
                } catch (e) {
                    addLog(`   ⚠️ Fallo extraccion de color, pero se guardo logo.`);
                    if (team.id) {
                        await teamService.update(team.id, { logoUrl: downloadUrl });
                    }
                }
            }
        } catch (error) {
            console.error(error);
            addLog(`❌ Error General: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 p-4 border rounded bg-card w-full max-h-[400px] overflow-auto">
            <Button onClick={processLogos} disabled={loading} variant="secondary" className="w-full">
                {loading ? "Procesando Logos..." : "Iniciar Auto-Asignación de Logos y Colores"}
            </Button>
            <div className="bg-black/80 text-green-400 font-mono text-xs p-2 rounded h-40 overflow-auto">
                {logs.length === 0 ? "Esperando iniciar..." : logs.map((l, i) => <div key={i}>{l}</div>)}
            </div>
        </div>
    );
}
