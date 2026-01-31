import {
    collection,
    doc,
    CollectionReference,
    DocumentReference,
    Query,
    query
} from "firebase/firestore";
import { ref, StorageReference } from "firebase/storage";
import { db, storage } from "./config";

// --- CONSTANTS ---
const COLLECTION_PREFIX = "lvf_";
const STORAGE_PREFIX = "lvf_assets/";

// --- FIRESTORE HELPERS ---

/**
 * Returns a CollectionReference with the strict 'lvf_' prefix.
 * @param path - The collection name (e.g., 'users', 'matches'). Automatically prefixed.
 * @param pathSegments - Optional additional segments for nested collections.
 */
export const lvfCollection = (path: string, ...pathSegments: string[]) => {
    const prefixedPath = path.startsWith(COLLECTION_PREFIX) ? path : `${COLLECTION_PREFIX}${path}`;
    return collection(db, prefixedPath, ...pathSegments);
};


/**
 * Helper to ensure document paths also respect the logic if manually constructing strings,
 * though typically you'd use lvfCollection(name) then doc().
 */
export const getCollectionName = (name: string) => {
    return name.startsWith(COLLECTION_PREFIX) ? name : `${COLLECTION_PREFIX}${name}`;
};

// --- STORAGE HELPERS ---

/**
 * Returns a StorageReference with the strict 'lvf_assets/' prefix.
 * @param path - The file path (e.g., 'teams/logo.png'). Automatically prefixed.
 */
export const lvfStorageRef = (path: string) => {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const fullPath = cleanPath.startsWith(STORAGE_PREFIX)
        ? cleanPath
        : `${STORAGE_PREFIX}${cleanPath}`;
    return ref(storage, fullPath);
};
