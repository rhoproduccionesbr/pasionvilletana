import { db } from "../firebase/config";
import { lvfCollection } from "../firebase/utils";
import { Match, MatchTeamSnapshot, Tournament } from "@/types";
import {
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    writeBatch,
    collection
} from "firebase/firestore";

const COLLECTION_NAME = "matches"; // lvf_matches

export const matchService = {
    /**
     * Get matches for a tournament
     */
    getByTournament: async (tournamentId: string): Promise<Match[]> => {
        const colRef = lvfCollection(COLLECTION_NAME);
        // Remove orderBy to avoid needing a composite index for now
        const q = query(colRef, where("tournamentId", "==", tournamentId));
        const snapshot = await getDocs(q);

        const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
        // Sort by round client-side
        return matches.sort((a, b) => (a.round || 0) - (b.round || 0));
    },

    /**
     * Generate Fixture (Round Robin)
     * Creates double matches if both categories are present
     */
    generateFixture: async (tournament: Tournament, teams: { id: string, name: string, logoUrl?: string }[]) => {
        if (!tournament.id) throw new Error("Tournament ID missing");

        const batch = writeBatch(db);
        const colRef = lvfCollection(COLLECTION_NAME);

        // Simple Round Robin Logic
        // If teams.length is odd, add a "BYE" (libre) team
        let participants = [...teams];
        if (participants.length % 2 !== 0) {
            participants.push({ id: "BYE", name: "Libre" });
        }

        const numRounds = participants.length - 1;
        const halfSize = participants.length / 2;
        const matches: Omit<Match, "id">[] = [];

        const categories = tournament.categories || ["primera"];

        // Loop rounds
        for (let round = 0; round < numRounds; round++) {
            // Loop matches in round
            for (let i = 0; i < halfSize; i++) {
                const home = participants[i];
                const away = participants[participants.length - 1 - i];

                // Skip if one is BYE
                if (home.id === "BYE" || away.id === "BYE") continue;

                // Create match object template
                const matchBase = {
                    tournamentId: tournament.id,
                    round: round + 1,
                    status: 'scheduled' as const,
                    createdAt: new Date(),
                    teams: {
                        home: { id: home.id, name: home.name, logoUrl: home.logoUrl, score: 0 },
                        away: { id: away.id, name: away.name, logoUrl: away.logoUrl, score: 0 }
                    }
                };

                // Create for each category
                categories.forEach(cat => {
                    const match: any = { ...matchBase, category: cat };

                    // Simple default scheduling logic:
                    // Date: Next Sunday + (7 days * round)
                    // Time: 15:00 for Primera, 13:00 for Juvenil
                    const today = new Date();
                    const nextSunday = new Date(today.setDate(today.getDate() + (7 - today.getDay()) + (round * 7)));

                    if (cat === "juvenil") {
                        nextSunday.setHours(13, 0, 0, 0);
                    } else {
                        nextSunday.setHours(15, 0, 0, 0);
                    }

                    match.date = nextSunday.toISOString();

                    const newDocRef = doc(colRef);
                    batch.set(newDocRef, match);
                });
            }

            // Rotate array for next round (Polygon method)
            // Keep first element fixed, rotate the rest
            const first = participants[0];
            const tail = participants.slice(1);
            const last = tail.pop();
            if (last) tail.unshift(last);
            participants = [first, ...tail];
        }

        await batch.commit();
    },

    deleteAllForTournament: async (tournamentId: string) => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const q = query(colRef, where("tournamentId", "==", tournamentId));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    },

    update: async (id: string, data: Partial<Match>) => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const docRef = doc(colRef, id);
        await updateDoc(docRef, data);
    }
};
