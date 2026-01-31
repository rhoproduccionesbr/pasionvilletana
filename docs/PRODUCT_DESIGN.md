# Professional Product Vision & Architecture

## Core Philosophy: "App-Like" Experience
To deliver a professional, high-end feel, this application moves away from "website" metaphors and adopts "native app" behaviors, even in the browser.

1.  **Mobile-First Vertical Design**: The primary interface is designed for vertical screens (phones/tablets). Desktop is an adaptive expansion, not the default.
2.  **Optimistic UI**: Actions (like scoring a goal or selling a ticket) reflect instantly on the screen while syncing in the background. No "spinners" for trivial actions.
3.  **Offline-Ready**: leveraging Firestore's offline persistence. Essential for stadium operations where connectivity is spotty.

## Technical Architecture (Serverless Adaptation)
*Translating existing requirements from Django/PostgreSQL to Next.js/Firebase.*

### 1. Data Layer: Firebase Firestore (NoSQL)
Instead of a relational monolith, we use a document-oriented approach. Use **Subcollections** vs **Root Collections** strategically.
* **Mandatory**: All collections prefixed with `lvf_`.
* **Structure**:
    * `lvf_tournaments/{id}`
        * `phases/{id}`
            * `matches/{id}` (Matches contained in phases for easy querying)
    * `lvf_teams/{id}` (Global team registry)
    * `lvf_matches/{id}` (Collection Group Index optimization for global scheduling)

### 2. Operations & Logic
* **Next.js Server Actions**: Secure backend logic (validation, complex calculations) without managing a dedicated server.
* **Cloud Functions (firebase-functions)**:
    * *Background Triggers*: Calculate standings automatically when a match result is updated.
    * *Security Critical*: Referee report hashing and token validation.

### 3. Specialized Features
* **PDF Generation**: Migrating from Server-side Python to **Client-side React-PDF** or Serverless Node.js. Generates "Acta del Partido" directly in the browser for instant printing.
* **QR Codes**: Generated on-the-fly (`react-qr-code`) for tickets and accreditation. No need to store images, just the payload string.

## Professional Feature Roadmap

### Phase 1: The Core (Foundation)
* [ ] **Team & Tournament Registry**: Manage the entities.
* [ ] **Fixture Management**: Drag-and-drop scheduling (using libraries like `dnd-kit`).

### Phase 2: Live Operations (The "Wow" Factor)
* [ ] **Digital Match Sheet (Planilla Digital)**: PWA interface for loading goals/cards in real-time.
* [ ] **Public Match Center**: Live feed of events for fans.

### Phase 3: Administration & Security
* [ ] **Referee Portal**: Token-based access for submitting secure reports.
* [ ] **Financials**: Ticket sales tracking and automated club account statements.

## Next Steps for Implementation
We recommend starting with **Phase 1: Core Data Models**, implementing the `Tournament` -> `Phase` -> `Match` hierarchy in Firestore.
