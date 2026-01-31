import { db } from "../firebase/config";
import { lvfCollection } from "../firebase/utils";
import { sanitizeForFirestore } from "../firebase/sanitize";
import { Tournament, MatchDay } from "@/types";
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
        const sanitized = sanitizeForFirestore({
            ...tournament,
            createdAt: new Date(),
            status: tournament.status || 'planned'
        });
        const docRef = await addDoc(colRef, sanitized);
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
        const sanitized = sanitizeForFirestore(data);
        await updateDoc(docRef, sanitized);
    },

    delete: async (id: string) => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const docRef = doc(colRef, id);
        await deleteDoc(docRef);
    },

    // --- Structural Updates ---

    updateSeries: async (id: string, seriesData: Tournament['seriesData']) => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const docRef = doc(colRef, id);
        const sanitized = sanitizeForFirestore({ seriesData });
        await updateDoc(docRef, sanitized);
    },

    updateMatchDays: async (id: string, matchDays: Tournament['matchDays']) => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const docRef = doc(colRef, id);
        const sanitized = sanitizeForFirestore({ matchDays });
        await updateDoc(docRef, sanitized);
    },

    // --- Helpers (Client-side mainly, but good to have here or in utils) ---
    // Recibe las fechas de IDA y genera las de VUELTA
    generateReturnMatchDays: (idaMatchDays: Tournament['matchDays'], startOrderOffset: number): MatchDay[] => {
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
                // Use null instead of undefined for fields we want to "reset"
                // Or simply omit them - the sanitizer will handle undefined
                status: 'scheduled' as const,
                events: [],
            }));

            return {
                ...day,
                id: crypto.randomUUID(),
                name: `Revancha - ${day.name}`,
                order: day.order + startOrderOffset,
                isReturnRound: true,
                matches: newMatches,
            };
        });
    }
};
