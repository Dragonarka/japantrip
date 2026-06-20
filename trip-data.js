// ============================================================
// Datos compartidos de superposición — fuente ÚNICA cargada por
// index.html (plan v3) y ades-japan-oct30-nov19.html (plan AdeS).
// Editar aquí actualiza la pestaña Superposición de AMBAS páginas.
// ============================================================

// Plan v3 (25 días): fecha "Mon D" → ciudad base de ese día
const V3_CITY=[
 ["Oct 27","Tokio"],["Oct 28","Tokio"],["Oct 29","Tokio"],["Oct 30","Tokio"],["Oct 31","Nikko"],
 ["Nov 1","Kawaguchiko"],["Nov 2","Tokio"],["Nov 3","Takayama"],["Nov 4","Takayama/Shirakawa"],["Nov 5","Kioto"],
 ["Nov 6","Kioto"],["Nov 7","Kioto"],["Nov 8","Kioto"],["Nov 9","Kioto"],["Nov 10","Kioto"],
 ["Nov 11","Osaka"],["Nov 12","Osaka"],["Nov 13","Osaka"],["Nov 14","Osaka"],["Nov 15","Kobe"],
 ["Nov 16","Kinosaki"],["Nov 17","Koyasan"],["Nov 18","Tokio"],["Nov 19","Tokio"],["Nov 20","Tokio"],
];

// Plan AdeS (21 días): fecha "Mon D" → ciudad base de ese día
const ADES_CITY={
 "Oct 30":"Tokio","Oct 31":"Tokio","Nov 1":"Tokio","Nov 2":"Tokio","Nov 3":"Fuji/Kawaguchiko",
 "Nov 4":"Kioto","Nov 5":"Kioto","Nov 6":"Kioto","Nov 7":"Kioto","Nov 8":"Osaka",
 "Nov 9":"Osaka","Nov 10":"Osaka","Nov 11":"Hiroshima","Nov 12":"Kanazawa","Nov 13":"Tokio (bus)",
 "Nov 14":"Tokio","Nov 15":"Tokio","Nov 16":"Tokio","Nov 17":"Tokio","Nov 18":"viaje","Nov 19":"Medellín",
};

// Ciudades consideradas "misma región Kansai" (cercanía ≤ ~1 h)
const KANSAI=["Kioto","Osaka","Nara","Fuji","Kobe"];

// Normaliza una etiqueta de ciudad a su primer token (ignora "/", "→", paréntesis)
function normCity(c){ return (c||"").split(/[\/→ ]/)[0]; }

// Ventanas de encuentro recomendadas (compartidas)
const OVERLAP_WINDOWS=[
 ['🟢 Kioto · 5–7 nov','La mejor ventana: 3 días en la misma ciudad. Cena + Fushimi Inari juntos.'],
 ['🟡 Kansai · 8–10 nov','v3 en Kioto, AdeS en Osaka. ~15 min en tren: día compartido en Nara/Dotonbori.'],
 ['🟢 Tokio · 30 oct','AdeS llega; v3 en su último día de Tokio. Cena de bienvenida.'],
 ['🟢 Tokio · 18 nov','v3 regresa a Tokio el día que AdeS vuela. Posible desayuno de despedida.'],
];
