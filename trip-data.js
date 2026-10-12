// ============================================================
// Datos + lógica de superposición — fuente ÚNICA cargada por
// index.html (plan V6) y ades-japan-oct30-nov19.html (plan AdeS).
// Editar aquí actualiza la pestaña Superposición de AMBAS páginas.
// ============================================================

// Plan AdeS "Grupo de 8" (21 días, 29 oct–18 nov): fecha "Mon D" → ciudad base de ese día.
// Itinerario REAL, fuente: data/itinerary.json de https://sergio0491.github.io/viaje-japon/
// (leído el 11 oct 2026). Reemplaza la versión anterior basada en un PDF desactualizado
// (esa tenía Hiroshima el 11 nov; el plan real pasa por Nagoya→Kanazawa en su lugar).
const ADES_CITY={
 "Oct 29":"Tokio","Oct 30":"Tokio","Oct 31":"Tokio","Nov 1":"Tokio","Nov 2":"Tokio",
 "Nov 3":"Fuji/Kawaguchiko","Nov 4":"Kioto","Nov 5":"Kioto","Nov 6":"Osaka",
 "Nov 7":"Osaka","Nov 8":"Nara→Osaka","Nov 9":"Osaka","Nov 10":"Osaka",
 "Nov 11":"Kanazawa","Nov 12":"Kanazawa","Nov 13":"Kanazawa","Nov 14":"Tokio",
 "Nov 15":"Tokio","Nov 16":"Tokio","Nov 17":"Tokio","Nov 18":"viaje",
};
// Seguimiento AdeS: fecha → qué hacen ese día (itinerario real, para coordinar encuentros)
const ADES_ACT={
 "Oct 29":"Llegada y check-in en Asakusa (4 de 8 llegan antes; Sergio/Arley vía LAX).","Oct 30":"Ueno, Museo Nacional, Ameyoko, Senso-ji y Skytree.","Oct 31":"Santuario Nezu, Yanaka Ginza, Halloween en Ikebukuro.","Nov 1":"Palacio Imperial, Kabuki-za (opc.), Akihabara — llega el resto del grupo por la tarde.","Nov 2":"Tsukiji, Odaiba, Roppongi Hills; tour JDM Fast & Furious en Daikoku.",
 "Nov 3":"Teleférico panorámico del Fuji, calles de Fujikawaguchiko, onsen Fuji Yurari.","Nov 4":"Pagoda Chureito, santuario Fuji Sengen → shinkansen a Kioto.","Nov 5":"Arashiyama (bambú), Tenryu-ji, Otagi Nenbutsuji, Kinkaku-ji, Castillo Nijō, Pontocho.","Nov 6":"Kiyomizu-dera, Higashiyama, Gion → traslado a Osaka.","Nov 7":"Kuromon, Den-Den Town, Shitennō-ji, Abeno Harukas, Shinsekai.",
 "Nov 8":"Daytrip a Nara: Tōdai-ji, venados, Kasuga-Taisha → Dotonbori de noche.","Nov 9":"Fushimi Inari (daytrip), Daigo-ji, Kyoto Ramen Koji, teamLab Biovortex.","Nov 10":"Día comodín en Osaka: USJ o Himeji-Kobe.","Nov 11":"Shinkansen Osaka→Nagoya→Kanazawa (maletas enviadas a Tokio).","Nov 12":"Jardín Kenroku-en, barrio Higashi Chaya, casa de té.",
 "Nov 13":"Barrio samurái Nagamachi, mercado Ōmichō, Castillo de Kanazawa.","Nov 14":"Shinkansen a Tokio; Shinjuku Gyoen, mirador del Ayuntamiento, Omoide Yokochō.","Nov 15":"Tokyo DisneySea (día completo).","Nov 16":"Meiji Jingu, Harajuku, Omotesando, Shibuya (3 del grupo ya regresan).","Nov 17":"Día libre en Tokio.","Nov 18":"Vuelos de regreso (Haneda/Osaka→LAX).",
};

// Plan V6 (23 días, 29 oct–20 nov): versión DEFINITIVA con Osaka como base/hub.
// Ciudad = lugar principal del día (en daytrips a Kioto/Kurama se marca Kioto para el
// encuentro real con AdeS; Nov10=Kurama y Nov12=USJ tras el swap por el ticket de USJ).
const V6_CITY=[
 ["Oct 29","Tokio"],["Oct 30","Tokio"],["Oct 31","Tokio"],["Nov 1","Tokio"],["Nov 2","Tokio"],
 ["Nov 3","Fuji"],["Nov 4","Nagano"],["Nov 5","Osaka"],["Nov 6","Kioto"],["Nov 7","Osaka"],
 ["Nov 8","Kioto"],["Nov 9","Osaka"],["Nov 10","Kioto"],["Nov 11","Osaka"],["Nov 12","Osaka"],
 ["Nov 13","Osaka"],["Nov 14","Tokio"],["Nov 15","Tokio"],["Nov 16","Tokio"],["Nov 17","Tokio"],
 ["Nov 18","Tokio"],["Nov 19","Tokio"],["Nov 20","Tokio"],
];

// Ciudades "misma región Kansai" (cercanía ≤ ~1 h)
const KANSAI=["Kioto","Osaka","Nara","Fuji","Kobe"];

// Normaliza una etiqueta de ciudad a su primer token (ignora "/", "→", espacios)
function normCity(c){ return (c||"").split(/[\/→ ]/)[0]; }

// Ventanas de encuentro recomendadas (compartidas por ambas páginas)
const OVERLAP_WINDOWS=[
 ['🟢 Tokio · 29 oct – 2 nov','5 días juntos al inicio: Asakusa/Senso-ji, Halloween en Ikebukuro/Shibuya, Tsukiji/Odaiba.'],
 ['🟢 Fuji · 3 nov','Ambos en Kawaguchiko el mismo día (horarios propios, sin coordinar).'],
 ['🟡 Osaka/Kioto · 5–10 nov','La ventana más ancha de cercanía: V6 con base fija en Osaka, AdeS pasando por Kioto→Osaka→Nara. Mejor chance real: Osaka 6–10 nov.'],
 ['⚪ Kanazawa vs Kurama/USJ · 11–13 nov','Sin cruce — AdeS en Kanazawa, V6 en Kurama/USJ/Uji. Mismo arco de fechas, ciudades distintas.'],
 ['🟢 Tokio · 14–17 nov','Recta final juntos — AdeS se va el 18, antes de nuestra despedida.'],
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
