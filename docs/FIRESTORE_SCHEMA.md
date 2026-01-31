# Estructura de Base de Datos Firestore (NoSQL)

Este documento define la estructura oficial de los documentos JSON para el proyecto `lvf-pwa`.
**Prefijo Obligatorio:** Todas las colecciones raíz deben comenzar con `lvf_`.

## 1. Colecciones Principales (Root)

### `lvf_leagues` (Ligas)
Perfil de la Liga (ej. "Pasión Villetana").
```json
{
  "id": "league-id",
  "name": "Liga Villetana de Fútbol",
  "shortName": "LVF",
  "logoUrl": "gs://...",
  "foundedYear": "1950",
  "address": "Villeta, Centro",
  "presidentName": "...",
  "contactEmail": "...",
  "stats": {
    "activeClubs": 19,
    "currentSeason": "2025"
  }
}
```

### `lvf_tournaments` (Torneos)
Representa una edición de un campeonato.
```json
{
  "id": "auto-generated-id",
  "leagueId": "league-id", // Vinculo a la liga
  "season": "2025",
  "name": "Súper Liga Villetana",
  "honorName": "Homenaje a Don Pepe",
  "status": "planned",
  "categories": ["primera", "juvenil"], // Categorias que disputan
  "format": {
    "type": "groups_to_playoffs",
    "groupsConfig": {
       "series": ["A", "B", "C"],
       "serieA_teams": 7,
       "serieB_teams": 6,
       "serieC_teams": 6
    }
  }
}
```

### `lvf_teams` (Clubes)
Registro maestro de clubes.
```json
{
  "id": "auto-generated-id",
  "name": "Club 12 de Octubre",
  "shortName": "12 Oct",
  "stadium": "Pa'i Beni",
  "location": "Naranjaisy", // Sede/Barrio
  "foundedDate": "1948-12-10",
  "logoUrl": "gs://...",
  "colors": {
    "primary": "#...",
    "secondary": "#..."
  },
  "socials": { ... },
  "status": "active"
}
```

### `lvf_players` (Personas / Jugadores)
Base de datos única de personas.
```json
{
  "id": "cedula-identidad",
  "personalInfo": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "nationalId": "1234567",
    "birthDate": "2000-01-01"
  },
  "technicalFile": {
    "position": "Delantero",
    "status": "enabled"
  }
}
```

## 2. Sub-Colecciones (Jerarquía)

### `lvf_tournaments/{tournamentId}/phases`
Fases: "Fase de Grupos", "Octavos", etc.
```json
{
  "id": "phase-id",
  "name": "Fase de Grupos",
  "type": "round_robin",
  "groups": ["A", "B", "C"], // Series definidas
  "status": "active"
}
```

### `lvf_tournaments/{tournamentId}/phases/{phaseId}/matches`
Partidos. Se distinguen por `category`.
```json
{
  "id": "match-id",
  "date": "2025-03-10T15:00:00Z",
  "round": 1, // Fecha 1, 2, etc.
  "category": "primera", // primera | juvenil
  "serie": "A", // Si aplica
  "teams": {
    "home": { "id": "t1", "name": "...", "score": 2 },
    "away": { "id": "t2", "name": "...", "score": 1 }
  },
  "status": "finished"
}
```
