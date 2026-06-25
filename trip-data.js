// ============================================================
// Datos + lógica de superposición — fuente ÚNICA cargada por
// index.html (plan v3) y ades-japan-oct30-nov19.html (plan AdeS).
// Editar aquí actualiza la pestaña Superposición de AMBAS páginas.
// ============================================================

// Plan v3 (25 días): fecha "Mon D" → ciudad base de ese día
// Nov 8: el v3 hace Fushimi Inari + Nara (swap para coincidir con AdeS en Nara).
const V3_CITY=[
 ["Oct 27","Tokio"],["Oct 28","Tokio"],["Oct 29","Tokio"],["Oct 30","Tokio"],["Oct 31","Nikko"],
 ["Nov 1","Kawaguchiko"],["Nov 2","Tokio"],["Nov 3","Takayama"],["Nov 4","Takayama/Shirakawa"],["Nov 5","Kioto"],
 ["Nov 6","Kioto"],["Nov 7","Kioto"],["Nov 8","Nara"],["Nov 9","Kioto"],["Nov 10","Kioto"],
 ["Nov 11","Osaka"],["Nov 12","Osaka"],["Nov 13","Osaka"],["Nov 14","Osaka"],["Nov 15","Kobe"],
 ["Nov 16","Kinosaki"],["Nov 17","Koyasan"],["Nov 18","Tokio"],["Nov 19","Tokio"],["Nov 20","Tokio"],
];

// Plan AdeS (21 días): fecha "Mon D" → ciudad base de ese día
const ADES_CITY={
 "Oct 30":"Tokio","Oct 31":"Tokio","Nov 1":"Tokio","Nov 2":"Tokio","Nov 3":"Fuji/Kawaguchiko",
 "Nov 4":"Kioto","Nov 5":"Kioto","Nov 6":"Kioto","Nov 7":"Kioto","Nov 8":"Nara→Osaka",
 "Nov 9":"Osaka","Nov 10":"Osaka","Nov 11":"Hiroshima","Nov 12":"Kanazawa","Nov 13":"Tokio (bus)",
 "Nov 14":"Tokio","Nov 15":"Tokio","Nov 16":"Tokio","Nov 17":"Tokio","Nov 18":"viaje","Nov 19":"Medellín",
};

// Plan V4 (25 días): re-secuencia del plan v3 para coincidir con AdeS.
// Conserva todos los must-do de v3 pero alinea ciudad+fecha con AdeS al máximo.
const V4_CITY=[
 ["Oct 27","Tokio"],["Oct 28","Tokio"],["Oct 29","Nikko"],["Oct 30","Tokio"],["Oct 31","Tokio"],
 ["Nov 1","Tokio"],["Nov 2","Tokio"],["Nov 3","Fuji"],["Nov 4","Takayama"],["Nov 5","Takayama/Shirakawa"],
 ["Nov 6","Kioto"],["Nov 7","Kioto"],["Nov 8","Nara"],["Nov 9","Osaka"],["Nov 10","Osaka"],
 ["Nov 11","Kinosaki"],["Nov 12","Koyasan"],["Nov 13","Tokio"],["Nov 14","Tokio"],["Nov 15","Tokio"],
 ["Nov 16","Tokio"],["Nov 17","Tokio"],["Nov 18","Tokio"],["Nov 19","Tokio"],["Nov 20","Tokio"],
];

// Plan V5 (23 días, 29 oct–20 nov): viaje inmersivo propio (5 amigos).
// Llega 29 oct noche; Fuji, Nagano (monos), Kioto, Osaka, Hiroshima, Fukuoka, Tokio final.
const V5_CITY=[
 ["Oct 29","Tokio"],["Oct 30","Tokio"],["Oct 31","Tokio"],["Nov 1","Tokio"],["Nov 2","Tokio"],
 ["Nov 3","Fuji"],["Nov 4","Nagano"],["Nov 5","Kioto"],["Nov 6","Kioto"],["Nov 7","Kioto"],
 ["Nov 8","Kioto"],["Nov 9","Osaka"],["Nov 10","Osaka"],["Nov 11","Hiroshima"],["Nov 12","Fukuoka"],
 ["Nov 13","Fukuoka"],["Nov 14","Tokio"],["Nov 15","Tokio"],["Nov 16","Tokio"],["Nov 17","Tokio"],
 ["Nov 18","Tokio"],["Nov 19","Tokio"],["Nov 20","Tokio"],
];

// Ciudades "misma región Kansai" (cercanía ≤ ~1 h)
const KANSAI=["Kioto","Osaka","Nara","Fuji","Kobe"];

// Normaliza una etiqueta de ciudad a su primer token (ignora "/", "→", espacios)
function normCity(c){ return (c||"").split(/[\/→ ]/)[0]; }

// Ventanas de encuentro recomendadas (compartidas)
const OVERLAP_WINDOWS=[
 ['🟢 Kioto · 5–7 nov','3 días en la misma ciudad. Cena + Fushimi Inari juntos.'],
 ['🟢 Nara · 8 nov','¡NUEVO! Ambos en Nara (v3 ahora hace Fushimi + Nara). Todai-ji y venados juntos.'],
 ['🟡 Kansai · 9–10 nov','v3 en Kioto, AdeS en Osaka. ~15 min en tren para compartir tarde/cena.'],
 ['🟢 Tokio · 30 oct / 18 nov','Bookends: cena de bienvenida y desayuno de despedida.'],
];

// ===================== LÓGICA DE SUPERPOSICIÓN =====================
// Índice absoluto de día desde el 1 oct (Oct=0+D, Nov=31+D).
function dIdx(s){ const p=String(s).split(' '); return (p[0]==='Oct'?0:31)+parseInt(p[1],10); }
const ADES_BY_IDX={};
Object.keys(ADES_CITY).forEach(dt=>{ ADES_BY_IDX[dIdx(dt)]=ADES_CITY[dt]; });
// Ciudad del grupo AdeS en la fecha calendario `date`, si su viaje se desfasa `offset` días.
function adesOn(date,offset){ return ADES_BY_IDX[dIdx(date)-(offset||0)]; }
function isMatch(v3,ad){ if(!ad||ad==='—'||ad==='viaje'||ad==='Medellín')return false; return normCity(ad)===normCity(v3)||(normCity(ad)==='Fuji'&&v3==='Kawaguchiko'); }
function isNear(v3,ad){ if(!ad||ad==='—'||ad==='viaje'||ad==='Medellín')return false; return KANSAI.includes(normCity(ad))&&['Kioto','Osaka','Nara'].includes(normCity(v3)); }
// Filas de la matriz para un plan (V3_CITY o V4_CITY) y un desfase de AdeS dado
function overlapRows(planArr,offset){
    return planArr.map(([date,city])=>{
        const ad=adesOn(date,offset)||'—';
        let cls='sup-none',label='—';
        if(isMatch(city,ad)){cls='sup-match';label='✓ Encuentro';}
        else if(isNear(city,ad)){cls='sup-near';label='≈ Cercanía';}
        return {date,v3:city,ad,cls,label};
    });
}
function overlapStats(planArr,offset){ let m=0,n=0; overlapRows(planArr,offset).forEach(r=>{ if(r.cls==='sup-match')m++; else if(r.cls==='sup-near')n++; }); return {m,n}; }
// Mejor desfase en ±range días (prioriza encuentros, luego cercanías)
function bestOffset(planArr,range){ range=range||7; let best={off:0,m:-1,n:-1}; for(let o=-range;o<=range;o++){ const s=overlapStats(planArr,o); if(s.m>best.m||(s.m===best.m&&s.n>best.n)) best={off:o,m:s.m,n:s.n}; } return best; }
