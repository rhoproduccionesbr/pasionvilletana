export type FirestoreDate = Date | { seconds: number; nanoseconds: number } | string;

// --- ROOT ENTITIES ---

export interface League {
    id?: string;
    name: string; // "Liga Villetana de Fútbol"
    shortName: string; // "LVF"
    logoUrl?: string;
    foundedYear?: string;
    address?: string;
    presidentName?: string;
    contactEmail?: string;
    stats?: {
        activeClubs: number;
        currentSeason: string;
    };
}

export interface Team {
    id?: string;
    name: string;
    shortName: string;
    stadium?: string; // Nuevo
    location?: string;
    foundedDate?: string; // Nuevo (YYYY-MM-DD or string)
    logoUrl?: string;
    colors?: {
        primary: string;
        secondary: string;
    };
    socials?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
    };
    history?: string; // Reseña histórica
    status: 'active' | 'suspended' | 'recess' | 'disaffiliated';
    stats?: {
        titles: number;
    };
    createdAt?: FirestoreDate;
    updatedAt?: FirestoreDate;
}

export interface Tournament {
    id?: string;
    leagueId?: string; // Link to parent league
    season: string;
    name: string;
    honorName?: string;
    status: 'planned' | 'active' | 'finished' | 'cancelled';
    categories?: ('primera' | 'juvenil')[]; // Primera, Juvenil
    startDate?: string;
    rulesUrl?: string;
    activePhaseId?: string;
    createdAt?: FirestoreDate;

    // Configuration & Rules
    config?: {
        format: 'league' | 'groups_to_playoff' | 'elimination';
        matchDuration: number; // minutes
        maxPlayersPerTeam: number;
        pointsForWin: number;
        pointsForDraw: number;
        pointsForLoss: number;
        playoffConfig?: {
            qualifiersPerGroup?: number;
            totalQualifiers?: number; // 16 for octavos
            singleMatchStages?: boolean; // Octavos/Cuartos/Semi ida y vuelta?
        };
        groupsConfig?: {
            series: string[]; // ["A", "B", "C"]
        };
    };
    seriesData?: TournamentSeries[]; // [ {name: 'A', teamIds: [...]}, ... ]
    matchDays?: MatchDay[]; // Subcollection preferred, but array for simple fetching


    // Sub-collection usage preferred, but keeping array for rapid prototyping if <30 teams
    // Actually, distinct subcollection `participating_teams` is better, but let's put simple linking in ID array first
    participatingTeamIds?: string[];
}

export interface ParticipatingTeam {
    id: string; // Document ID: {tournamentId}_{teamId}
    teamId: string;
    teamName: string;
    tournamentId: string;
    serie?: string; // A, B, C
    categories: ('primera' | 'juvenil')[];
    stats?: {
        played: number;
        points: number;
        // ...
    };
}

export interface Player {
    id?: string;
    personalInfo: {
        firstName: string;
        lastName: string;
        nationalId: string;
        birthDate?: string;
        nationality?: string;
        photoUrl?: string;
    };
    technicalFile: {
        position: string;
        preferredFoot?: 'Right' | 'Left' | 'Both';
        status: 'enabled' | 'suspended';
    };
    careerStats?: {
        totalGoals?: number;
        totalMatches?: number;
    };
}

// --- DEPENDENT ENTITIES ---

export interface TournamentPhase {
    id?: string;
    tournamentId?: string;
    name: string;
    type: 'groups' | 'elimination' | 'league';
    order: number;
    status: 'active' | 'pending' | 'finished';
}

export interface MatchTeamSnapshot {
    id: string; // teamId
    name: string;
    logoUrl?: string;
    score: number;
    penalties?: number;
}

export interface MatchEvent {
    type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
    minute: number;
    playerId: string;
    playerName: string;
    teamId: string;
    additionalInfo?: string;
}

export interface Match {
    id?: string;
    phaseId?: string;
    tournamentId?: string;
    date?: string;
    round?: number; // Fecha 1, 2...
    category?: 'primera' | 'juvenil';
    serie?: string; // "A", "B", "C"
    field?: string;
    location?: string; // Alias for field
    status: 'scheduled' | 'in_progress' | 'finished' | 'suspended' | 'rescheduled';
    rescheduleReason?: string; // "Lluvia", "Acuerdo clubes", etc.
    isReturnLeg?: boolean; // True si es partido de vuelta
    teams: {
        home: MatchTeamSnapshot;
        away: MatchTeamSnapshot;
    };
    events?: MatchEvent[];
    refereeIds?: string[];
    createdAt?: FirestoreDate;
}

export interface MatchDay {
    id: string; // "fecha_1", "fecha_2"
    name: string; // "Fecha 1", "Cuartos de Final"
    order: number;
    phaseId: string; // "fase_grupos"
    serie?: string; // "A", "B", "C"
    matches: Match[]; // Array de partidos de esta fecha
    freeTeamId?: string; // ID del equipo libre (para series impares)
    isReturnRound?: boolean; // Si pertenece a la ronda de revanchas
    status: 'active' | 'pending' | 'finished';
}

export interface TournamentSeries {
    name: "A" | "B" | "C";
    teamIds: string[];
    stats?: Record<string, any>; // Posiciones cacheadas
}

