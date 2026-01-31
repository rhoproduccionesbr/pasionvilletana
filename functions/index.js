const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Función de ejemplo para el reporte de partidos
exports.onMatchUpdate = functions.firestore
    .document("matches/{matchId}")
    .onUpdate((change, context) => {
        const newValue = change.after.data();
        console.log("Partido actualizado:", context.params.matchId, newValue);
        // Aquí irá la lógica para actualizar tablas y generar flyers
        return null;
    });
