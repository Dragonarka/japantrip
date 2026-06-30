// ============================================================
// Datos + lógica de superposición — fuente ÚNICA cargada por
// index.html (plan V6) y ades-japan-oct30-nov19.html (plan AdeS).
// Editar aquí actualiza la pestaña Superposición de AMBAS páginas.
// ============================================================

// Plan AdeS (21 días): fecha "Mon D" → ciudad base de ese día (itinerario real del otro grupo)
const ADES_CITY={
 "Oct 30":"Tokio","Oct 31":"Tokio","Nov 1":"Tokio","Nov 2":"Tokio","Nov 3":"Fuji/Kawaguchiko",
 "Nov 4":"Kioto","Nov 5":"Kioto","Nov 6":"Kioto","Nov 7":"Kioto","Nov 8":"Nara→Osaka",
 "Nov 9":"Osaka","Nov 10":"Osaka","Nov 11":"Hiroshima","Nov 12":"Kanazawa","Nov 13":"Tokio (bus)",
 "Nov 14":"Tokio","Nov 15":"Tokio","Nov 16":"Tokio","Nov 17":"Tokio","Nov 18":"viaje","Nov 19":"Medellín",
};

// Seguimiento AdeS: fecha → qué hacen ese día (itinerario real del otro grupo, para coordinar encuentros)
const ADES_ACT={
 "Oct 30":"Asakusa, Ueno · templos y skyline","Oct 31":"Yanaka + Halloween (Ikebukuro)","Nov 1":"Palacio Imperial + Akihabara","Nov 2":"Tsukiji + Odaiba (bahía y torres)","Nov 3":"Fuji: lagos y onsen",
 "Nov 4":"Pagoda Chureito → Kioto","Nov 5":"Arashiyama (bambú) + Kinkaku-ji","Nov 6":"Higashiyama y Gion","Nov 7":"Fushimi Inari (mil toriis)","Nov 8":"Venados de Nara → Osaka",
 "Nov 9":"Osaka clásico (castillo, Dotonbori)","Nov 10":"Día comodín en Osaka","Nov 11":"Hiroshima + Miyajima (noche allá)","Nov 12":"Hiroshima → Kanazawa (jardines)","Nov 13":"Barrio samurái Kanazawa → Tokio (bus)",
 "Nov 14":"Tokio: jardín y miradores","Nov 15":"Meiji, Harajuku y Shibuya","Nov 16":"Día libre + teamLab","Nov 17":"Despedida gastronómica","Nov 18":"Vuelos Tokio→casa","Nov 19":"Medellín",
};

// Plan V6 (23 días, 29 oct–20 nov): versión DEFINITIVA con Osaka como base/hub.
// Ciudad = lugar principal del día (en daytrips a Kioto se marca Kioto para el encuentro real con AdeS).
const V6_CITY=[
 ["Oct 29","Tokio"],["Oct 30","Tokio"],["Oct 31","Tokio"],["Nov 1","Tokio"],["Nov 2","Tokio"],
 ["Nov 3","Fuji"],["Nov 4","Nagano"],["Nov 5","Osaka"],["Nov 6","Kioto"],["Nov 7","Osaka"],
 ["Nov 8","Kioto"],["Nov 9","Osaka"],["Nov 10","Osaka"],["Nov 11","Osaka"],["Nov 12","Osaka"],
 ["Nov 13","Osaka"],["Nov 14","Tokio"],["Nov 15","Tokio"],["Nov 16","Tokio"],["Nov 17","Tokio"],
 ["Nov 18","Tokio"],["Nov 19","Tokio"],["Nov 20","Tokio"],
];

// Ciudades "misma región Kansai" (cercanía ≤ ~1 h)
const KANSAI=["Kioto","Osaka","Nara","Fuji","Kobe"];

// Normaliza una etiqueta de ciudad a su primer token (ignora "/", "→", espacios)
function normCity(c){ return (c||"").split(/[\/→ ]/)[0]; }

// Ventanas de encuentro recomendadas (compartidas)
const OVERLAP_WINDOWS=[
 ['🟢 Tokio · 30 oct – 2 nov','4 días juntos al inicio: bienvenida, teamLab Planets, Halloween en Shibuya, Kamakura.'],
 ['🟢 Fuji · 3 nov','Lago Kawaguchi y onsen el mismo día (cada grupo en su ryokan).'],
 ['🟢 Kioto · 6 nov','V6 hace daytrip a Kioto (donde está AdeS): Fushimi, templos y cena en Pontocho juntos.'],
 ['🟢 Osaka · 9–10 nov','AdeS en Osaka y V6 con base ahí: Dotonbori y USJ juntos.'],
 ['🟢 Tokio · 14–17 nov','Recta final juntos: Shichi-Go-San, compras y cena de despedida.'],
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
