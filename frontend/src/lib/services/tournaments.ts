import { db } from "../firebase/config";
import { lvfCollection } from "../firebase/utils";
import { Tournament } from "@/types";
import {
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    orderBy,
    query
} from "firebase/firestore";

const COLLECTION_NAME = "tournaments"; // Will be prefixed to 'lvf_tournaments'

export const tournamentService = {
    create: async (tournament: Omit<Tournament, "id">) => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const docRef = await addDoc(colRef, {
            ...tournament,
            createdAt: new Date(),
            status: tournament.status || 'planned'
        });
        return docRef.id;
    },

    getAll: async (): Promise<Tournament[]> => {
        const colRef = lvfCollection(COLLECTION_NAME);
        // Order by season descending by default
        const q = query(colRef, orderBy("season", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
    },

    update: async (id: string, data: Partial<Tournament>) => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const docRef = doc(colRef, id);
        await updateDoc(docRef, { ...data });
    },

    delete: async (id: string) => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const docRef = doc(colRef, id); // Ensure deleteDoc is imported
        await deleteDoc(docRef);
    },

    // --- Structural Updates ---

    updateSeries: async (id: string, seriesData: Tournament['seriesData']) => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const docRef = doc(colRef, id);
        await updateDoc(docRef, { seriesData });
    },

    updateMatchDays: async (id: string, matchDays: Tournament['matchDays']) => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const docRef = doc(colRef, id);
        await updateDoc(docRef, { matchDays });
    },

    // --- Helpers (Client-side mainly, but good to have here or in utils) ---
    // Recibe las fechas de IDA y genera las de VUELTA
    generateReturnMatchDays: (idaMatchDays: Tournament['matchDays'], startOrderOffset: number): Tournament['matchDays'] => {
        if (!idaMatchDays) return [];

        return idaMatchDays.map(day => {
            const newMatches = day.matches.map(m => ({
                ...m,
                id: crypto.randomUUID(), // New ID
                isReturnLeg: true,
                teams: {
                    home: m.teams.away, // Swap
                    away: m.teams.home
                },
                score: undefined, // Reset
                status: 'scheduled' as const,
                events: [],
                date: undefined // To be set manually or via logic
            }));

            return {
                ...day,
                id: crypto.randomUUID(),
                name: `Revancha - ${day.name}`,
                order: day.order + startOrderOffset, // e.g. Fecha 1 is order 1. Vuelta starts at order 10?
                isReturnRound: true,
                matches: newMatches,
                // freeTeamId se mantiene igual (si A queda libre en la ida, queda libre en la vuelta)
            };
        });
    }
};
