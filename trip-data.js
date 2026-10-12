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
 ["Nov 8","Kioto"],["Nov 9","Osaka"],["Nov 10","Osaka"],["Nov 11","Osaka"],["Nov 12","Kioto"],
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
 ['🟢 Fuji · 3 nov','Lago Kawaguchi y atardecer el mismo día (cada grupo en su alojamiento — AdeS ryokan, V6 villa).'],
 ['🟢 Kioto · 6 nov','V6 hace daytrip a Kioto (donde está AdeS): Fushimi, templos y cena en Pontocho juntos.'],
 ['🟢 Osaka · 9–10 nov','AdeS en Osaka; V6 en Kurama el 10 (USJ se movió al 12, ya sin AdeS en la ciudad) — posible Dotonbori juntos de noche.'],
 ['🟢 Tokio · 14–17 nov','Recta final juntos: Shichi-Go-San, compras y cena de despedida.'],
];

// Plan Sergio "Grupo de 8" (21 días, 29 oct–18 nov): fecha "Mon D" → ciudad base de ese día.
// Fuente: data/itinerary.json de https://sergio0491.github.io/viaje-japon/ (leído el 11 oct 2026).
const SERGIO_CITY={
 "Oct 29":"Tokio","Oct 30":"Tokio","Oct 31":"Tokio","Nov 1":"Tokio","Nov 2":"Tokio",
 "Nov 3":"Fuji/Kawaguchiko","Nov 4":"Kioto","Nov 5":"Kioto","Nov 6":"Osaka",
 "Nov 7":"Osaka","Nov 8":"Nara→Osaka","Nov 9":"Osaka","Nov 10":"Osaka",
 "Nov 11":"Kanazawa","Nov 12":"Kanazawa","Nov 13":"Kanazawa","Nov 14":"Tokio",
 "Nov 15":"Tokio","Nov 16":"Tokio","Nov 17":"Tokio","Nov 18":"viaje",
};
// Seguimiento Sergio: fecha → qué hacen ese día (itinerario real, para coordinar encuentros)
const SERGIO_ACT={
 "Oct 29":"Llegada y check-in en Asakusa (4 de 8 llegan antes; Sergio/Arley vía LAX).","Oct 30":"Ueno, Museo Nacional, Ameyoko, Senso-ji y Skytree.","Oct 31":"Santuario Nezu, Yanaka Ginza, Halloween en Ikebukuro.","Nov 1":"Palacio Imperial, Kabuki-za (opc.), Akihabara — llega el resto del grupo por la tarde.","Nov 2":"Tsukiji, Odaiba, Roppongi Hills; tour JDM Fast & Furious en Daikoku.",
 "Nov 3":"Teleférico panorámico del Fuji, calles de Fujikawaguchiko, onsen Fuji Yurari.","Nov 4":"Pagoda Chureito, santuario Fuji Sengen → shinkansen a Kioto.","Nov 5":"Arashiyama (bambú), Tenryu-ji, Otagi Nenbutsuji, Kinkaku-ji, Castillo Nijō, Pontocho.","Nov 6":"Kiyomizu-dera, Higashiyama, Gion → traslado a Osaka.","Nov 7":"Kuromon, Den-Den Town, Shitennō-ji, Abeno Harukas, Shinsekai.",
 "Nov 8":"Daytrip a Nara: Tōdai-ji, venados, Kasuga-Taisha → Dotonbori de noche.","Nov 9":"Fushimi Inari (daytrip), Daigo-ji, Kyoto Ramen Koji, teamLab Biovortex.","Nov 10":"Día comodín en Osaka: USJ o Himeji-Kobe.","Nov 11":"Shinkansen Osaka→Nagoya→Kanazawa (maletas enviadas a Tokio).","Nov 12":"Jardín Kenroku-en, barrio Higashi Chaya, casa de té.",
 "Nov 13":"Barrio samurái Nagamachi, mercado Ōmichō, Castillo de Kanazawa.","Nov 14":"Shinkansen a Tokio; Shinjuku Gyoen, mirador del Ayuntamiento, Omoide Yokochō.","Nov 15":"Tokyo DisneySea (día completo).","Nov 16":"Meiji Jingu, Harajuku, Omotesando, Shibuya (3 del grupo ya regresan).","Nov 17":"Día libre en Tokio.","Nov 18":"Vuelos de regreso (Haneda/Osaka→LAX).",
};
const OVERLAP_WINDOWS_SERGIO=[
 ['🟢 Tokio · 29 oct – 2 nov','Ambos grupos en Tokio al inicio — posible cruce en Asakusa/Senso-ji o Akihabara.'],
 ['🟡 Fuji · 3 nov','Los dos en la zona de Kawaguchiko el mismo día (horarios distintos, sin coordinar).'],
 ['🟢 Osaka · 6–9 nov','V6 con base fija ahí (5–13 nov) y Sergio pasa por Osaka 6–10 nov — la ventana más amplia de cruce posible.'],
 ['🟡 Kanazawa / Kurama · 11–12 nov','Sergio en Kanazawa mientras V6 está en Kurama/USJ — mismo arco de fechas, ciudades distintas.'],
 ['🟢 Tokio · 14–18 nov','Recta final de ambos en Tokio — coincide con nuestra última semana (14–20 nov).'],
];

// ===================== LÓGICA DE SUPERPOSICIÓN =====================
// Índice absoluto de día desde el 1 oct (Oct=0+D, Nov=31+D).
function dIdx(s){ const p=String(s).split(' '); return (p[0]==='Oct'?0:31)+parseInt(p[1],10); }
function buildByIdx(cityMap){ const r={}; Object.keys(cityMap).forEach(dt=>{ r[dIdx(dt)]=cityMap[dt]; }); return r; }
const ADES_BY_IDX=buildByIdx(ADES_CITY);
const SERGIO_BY_IDX=buildByIdx(SERGIO_CITY);
// Ciudad del otro grupo (byIdx) en la fecha calendario `date`, si su viaje se desfasa `offset` días.
function cityOnFrom(byIdx,date,offset){ return byIdx[dIdx(date)-(offset||0)]; }
function adesOn(date,offset){ return cityOnFrom(ADES_BY_IDX,date,offset); }
function sergioOn(date,offset){ return cityOnFrom(SERGIO_BY_IDX,date,offset); }
function isMatch(v3,ad){ if(!ad||ad==='—'||ad==='viaje'||ad==='Medellín')return false; return normCity(ad)===normCity(v3)||(normCity(ad)==='Fuji'&&v3==='Kawaguchiko'); }
function isNear(v3,ad){ if(!ad||ad==='—'||ad==='viaje'||ad==='Medellín')return false; return KANSAI.includes(normCity(ad))&&['Kioto','Osaka','Nara'].includes(normCity(v3)); }
// Filas de la matriz para un plan (V3_CITY o V4_CITY) contra un grupo (byIdx) y un desfase dado
function overlapRowsFrom(planArr,byIdx,offset){
    return planArr.map(([date,city])=>{
        const ad=cityOnFrom(byIdx,date,offset)||'—';
        let cls='sup-none',label='—';
        if(isMatch(city,ad)){cls='sup-match';label='✓ Encuentro';}
        else if(isNear(city,ad)){cls='sup-near';label='≈ Cercanía';}
        return {date,v3:city,ad,cls,label};
    });
}
function overlapStatsFrom(planArr,byIdx,offset){ let m=0,n=0; overlapRowsFrom(planArr,byIdx,offset).forEach(r=>{ if(r.cls==='sup-match')m++; else if(r.cls==='sup-near')n++; }); return {m,n}; }
// Mejor desfase en ±range días (prioriza encuentros, luego cercanías)
function bestOffsetFrom(planArr,byIdx,range){ range=range||7; let best={off:0,m:-1,n:-1}; for(let o=-range;o<=range;o++){ const s=overlapStatsFrom(planArr,byIdx,o); if(s.m>best.m||(s.m===best.m&&s.n>best.n)) best={off:o,m:s.m,n:s.n}; } return best; }
// Wrappers AdeS (firma original — los siguen usando index.html y ades-japan-oct30-nov19.html)
function overlapRows(planArr,offset){ return overlapRowsFrom(planArr,ADES_BY_IDX,offset); }
function overlapStats(planArr,offset){ return overlapStatsFrom(planArr,ADES_BY_IDX,offset); }
function bestOffset(planArr,range){ return bestOffsetFrom(planArr,ADES_BY_IDX,range); }
// Wrappers Sergio "Grupo de 8"
function overlapRowsSergio(planArr,offset){ return overlapRowsFrom(planArr,SERGIO_BY_IDX,offset); }
function overlapStatsSergio(planArr,offset){ return overlapStatsFrom(planArr,SERGIO_BY_IDX,offset); }
function bestOffsetSergio(planArr,range){ return bestOffsetFrom(planArr,SERGIO_BY_IDX,range); }
