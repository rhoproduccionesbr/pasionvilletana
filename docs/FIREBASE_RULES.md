# FIREBASE CONSTRAINTS & NAMING CONVENTIONS

> [!IMPORTANT]
> **SHARED PROJECT WARNING**: This application connects to a Firebase project shared with other applications.
> To prevent data collisions and data loss, STRICT naming conventions must be followed.

## 1. Collection Naming Rule
**ALL** Firestore collections created or accessed by this application **MUST** start with the prefix `lvf_`.

- **Correct**: `lvf_users`, `lvf_matches`, `lvf_teams`
- **INCORRECT**: `users`, `matches`, `teams`

### Implementation Guide
When creating Firestore helper functions, always prepend the prefix:

```typescript
const COLLECTION_PREFIX = "lvf_";

export const getCollectionName = (name: string) => `${COLLECTION_PREFIX}${name}`;
// Usage: collection(db, getCollectionName('users'))
```

## 2. Storage Path Rule
**ALL** files uploaded to Firebase Storage **MUST** be stored under a root directory named `lvf_assets` or similar prefixed paths.

- **Correct**: `/lvf_assets/logos/team1.png`
- **INCORRECT**: `/logos/team1.png`, `/images/user.jpg`

## 3. Cloud Functions
If Cloud Functions are required, they should be namespaced to avoid deployment overwrites if multiple apps deploy functions to the same project.
- **Function Name Prefix**: `lvf_`
- Example: `exports.lvf_onMatchCreate = onDocumentCreated("lvf_matches/{matchId}", ...)`

## 4. Authentication
Note that Firebase Auth Users are shared across the entire project.
- User metadata or profiles specific to this app must be stored in the `lvf_users` Firestore collection to distinguish them from users of other apps.
