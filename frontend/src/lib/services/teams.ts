import { db } from "../firebase/config";
import { lvfCollection } from "../firebase/utils";
import { Team } from "@/types";
import {
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where
} from "firebase/firestore";

const COLLECTION_NAME = "teams"; // Will be prefixed to 'lvf_teams'

export const teamService = {
    /**
     * Create a new team in 'lvf_teams'
     */
    create: async (team: Omit<Team, "id">) => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const docRef = await addDoc(colRef, {
            ...team,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: team.status || 'active'
        });
        return docRef.id;
    },

    /**
     * Get all teams
     */
    getAll: async (): Promise<Team[]> => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const snapshot = await getDocs(colRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
    },

    /**
     * Get active teams only
     */
    getActive: async (): Promise<Team[]> => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const q = query(colRef, where("status", "==", "active"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
    },

    update: async (id: string, data: Partial<Team>) => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const docRef = doc(colRef, id); // Note: doc() needs firestore instance? No, just CollectionReference or Path? NO.
        // Actually doc() takes (Firestore, path) OR (CollectionReference, path). 
        // lvfCollection returns CollectionReference.
        // But doc(colRef, id) is valid in Modular SDK. 
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date()
        });
    },

    delete: async (id: string) => {
        const colRef = lvfCollection(COLLECTION_NAME);
        const docRef = doc(colRef, id);

        // Get doc to check for logoUrl
        const typeDoc = await import("firebase/firestore").then(m => m.getDoc(docRef));
        const data = typeDoc.data() as Team | undefined;

        if (data?.logoUrl) {
            try {
                // Determine logic for ref. simple way: ref(storage, url) works?
                // Yes, ref(storage, url) creates a ref from URL.
                const { ref, deleteObject } = await import("firebase/storage");
                const { storage } = await import("../firebase/config");

                const imageRef = ref(storage, data.logoUrl);
                await deleteObject(imageRef);
                console.log("Logo deleted from storage");
            } catch (err) {
                console.warn("Could not delete logo from storage", err);
            }
        }

        await deleteDoc(docRef);
    }
};
