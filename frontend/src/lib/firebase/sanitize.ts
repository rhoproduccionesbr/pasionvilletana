/**
 * Firebase/Firestore utility functions
 */

/**
 * Recursively removes undefined values from an object.
 * Firestore doesn't accept undefined, so we need to clean data before saving.
 */
export function sanitizeForFirestore<T>(obj: T): T {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeForFirestore(item)) as T;
    }

    if (typeof obj === 'object' && obj !== null) {
        const cleaned: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== undefined) {
                cleaned[key] = sanitizeForFirestore(value);
            }
        }
        return cleaned as T;
    }

    return obj;
}
