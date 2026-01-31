"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { teamService } from "@/lib/services/teams";

const INITIAL_TEAMS_DATA = [
    { id: "1", name: "12 de Octubre", shortName: "12 Oct", stadium: "Pa'i Beni", location: "Naranjaisy", foundedDate: "1948-12-10", serie: "A" },
    { id: "2", name: "2 de Mayo", shortName: "2 May", stadium: "Estanislao Rojas", location: "Ita Ybate", foundedDate: "1926-02-05", serie: "A" },
    { id: "3", name: "8 de Diciembre", shortName: "8 Dic", stadium: "Eulogio Noguera", location: "Tacuruty", foundedDate: "1962-08-12", serie: "A" },
    { id: "4", name: "Cerro León", shortName: "CCL", stadium: "Esteban Cabrera", location: "Naranjaisy", foundedDate: "1918-09-18", serie: "A" },
    { id: "5", name: "Ita Ybate", shortName: "Ita", stadium: "Vicente Gómez", location: "Ita Yvate", foundedDate: "1926-08-15", serie: "A" },
    { id: "6", name: "Lomas Valentina", shortName: "Lomas", stadium: "Valerio Sanabria", location: "Ita Ybate", foundedDate: "1949-12-21", serie: "A" },
    { id: "7", name: "Universo", shortName: "Uni", stadium: "Cresencio Chávez", location: "Tacuruty", foundedDate: "1949-02-08", serie: "A" },
    { id: "8", name: "13 de Mayo", shortName: "13 May", stadium: "13 de Mayo", location: "Tacuaty", foundedDate: "1995-05-13", serie: "B" },
    { id: "9", name: "1ro de Marzo", shortName: "1 Mar", stadium: "Diosnel Olmedo", location: "Guazú Corá", foundedDate: "1949-02-14", serie: "B" },
    { id: "10", name: "1ro de Mayo", shortName: "1 May", stadium: "Cosme Centurión", location: "B. San Martín", foundedDate: "1990-07-12", serie: "B" },
    { id: "11", name: "22 de Mayo", shortName: "22 May", stadium: "Guillermo Aguayo", location: "Naranjaisy", foundedDate: "1949-05-22", serie: "B" },
    { id: "12", name: "3 de Febrero", shortName: "3 Feb", stadium: "3 de Febrero", location: "Naranjaisy", foundedDate: "1970-03-02", serie: "B" },
    { id: "13", name: "Mariscal E.", shortName: "Mcal", stadium: "Orlando Aquino Rivero", location: "Guazú Corá", foundedDate: "1967-09-29", serie: "B" },
    { id: "14", name: "3 de Noviembre", shortName: "3 Nov", stadium: "3 de Noviembre", location: "Valle Po'i", foundedDate: "1969-03-11", serie: "C" },
    { id: "15", name: "4 de Octubre", shortName: "4 Oct", stadium: "4 de Octubre", location: "Valle Po'i", foundedDate: "1969-10-04", serie: "C" },
    { id: "16", name: "FBC Cumbariteño", shortName: "Cumba", stadium: "Heriberto Reinoso", location: "Cumbarity", foundedDate: "1936-03-03", serie: "C" },
    { id: "17", name: "Hijos de Mayo", shortName: "Hijos", stadium: "Capitán Ramón García", location: "B. Inmaculada", foundedDate: "1918-05-18", serie: "C" },
    { id: "18", name: "Libertad", shortName: "Libertad", stadium: "Héroes Villetanos del Chaco", location: "B. San Juan", foundedDate: "1927-01-30", serie: "C" },
    { id: "19", name: "Villetano", shortName: "Villetano", stadium: "20 de Julio", location: "Cumbarity", foundedDate: "1950-07-20", serie: "C" },
];

export function SeedTeamsButton() {
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        if (!confirm("Esto cargará 19 equipos. ¿Continuar?")) return;
        setLoading(true);
        try {
            let count = 0;
            for (const team of INITIAL_TEAMS_DATA) {
                // Check if exists logic could be here, but for now we attempt create
                // We pass the raw object.
                await teamService.create({
                    name: team.name,
                    shortName: team.shortName,
                    stadium: team.stadium,
                    location: team.location,
                    status: 'active',
                    // Defaulting some colors/socials
                    colors: { primary: '#000000', secondary: '#ffffff' },
                    socials: {},
                    stats: { titles: 0 }
                });
                count++;
                console.log(`Seeded ${team.name}`);
            }
            alert(`Se cargaron ${count} equipos con éxito.`);
        } catch (error) {
            console.error(error);
            alert("Error en la carga masiva.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="outline" onClick={handleSeed} disabled={loading}>
            {loading ? "Cargando..." : "Cargar Datos Iniciales (19 Equipos)"}
        </Button>
    );
}
