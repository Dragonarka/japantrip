// ============================================================
// Datos + lógica de superposición — fuente ÚNICA cargada por
// index.html (plan V6) y ades-japan-oct30-nov19.html (plan AdeS).
// Editar aquí actualiza la pestaña Superposición de AMBAS páginas.
// ============================================================

// Grupo AdeS (8 viajeros, 29 oct–18 nov): fecha "Mon D" → dónde están ese día ("A→B" = de día en A, duermen en B).
// Fuente: data/itinerary.json de https://sergio0491.github.io/viaje-japon/ (generado el 5 oct; revisado el 27 oct 2026).
const ADES_CITY={
 "Oct 29":"Tokio","Oct 30":"Tokio","Oct 31":"Tokio","Nov 1":"Tokio","Nov 2":"Tokio",
 "Nov 3":"Fuji/Kawaguchiko","Nov 4":"Fuji→Kioto","Nov 5":"Kioto","Nov 6":"Kioto→Osaka",
 "Nov 7":"Osaka","Nov 8":"Nara→Osaka","Nov 9":"Kioto→Osaka","Nov 10":"Osaka",
 "Nov 11":"Nagoya→Kanazawa","Nov 12":"Kanazawa","Nov 13":"Kanazawa","Nov 14":"Tokio",
 "Nov 15":"Tokio","Nov 16":"Tokio","Nov 17":"Tokio","Nov 18":"viaje",
};
// Seguimiento AdeS: fecha → qué hacen ese día, con horas y quién va (para coordinar encuentros)
const ADES_ACT={
 "Oct 29":"Llegan 6 de 8 (todos menos Sergio y Arley) y hacen check-in en el Establishment Asakusa (Oshiage) ~22:40.",
 "Oct 30":"Ueno Park 9:00, Museo Nacional, Ameyoko, Nakamise 14:45 (almuerzo), Senso-ji 16:50 y Tokyo Skytree 18:54–20:24. Sergio y Arley vuelan Medellín→LA.",
 "Oct 31":"Santuario Nezu 9:00, Yanaka Ginza (almuerzo) e Ikebukuro: Sunshine City 13:00 y Halloween 15:20–16:50. Noche libre. Sergio y Arley vuelan LAX→Narita (SQ 11).",
 "Nov 1":"Palacio Imperial 10:00, Kabuki-za (opcional) 12:30, Pokémon Center 15:10 y Akihabara 17:00–19:00. Sergio y Arley aterrizan en Narita 17:40 → Tobu Levant (Kinshicho).",
 "Nov 2":"Los 8: Tsukiji 8:00 (desayuno), Odaiba, Roppongi Hills hasta 16:15. Sergio, Arley, Pipe y Johan: tour Rápido y Furioso (Aomi, 17:30–21:30). Julián, Mafalda, Tati y Sebas: Torre de Tokio y de vuelta a Oshiage ~19:10.",
 "Nov 3":"Maletas por Yamato a Osaka 5:45, tren Fuji Excursion 7:07, teleférico 11:00, almuerzo en Kawaguchiko 13:00, Parque Ōishi 14:00–15:00 y onsen Fuji Yurari 16:00–21:00. Duermen en un Airbnb en Fujiyoshida.",
 "Nov 4":"Pagoda Chureito 7:30, calle retro de Fujiyoshida, Fuji Sengen (almuerzo), bus a Mishima 14:00 (falta reservar) y Shinkansen a Kioto 16:00.",
 "Nov 5":"Kioto largo: Arashiyama 7:30, Tenryu-ji, Otagi Nenbutsuji (se corta si hay cansancio), Kinkaku-ji, Castillo Nijō, baños públicos y cena en Pontocho 18:30.",
 "Nov 6":"Kiyomizu-dera 6:30, Sannenzaka, Yasaka, Higashiyama 9:30–13:00 (almuerzo), Gion 13:00–16:00 → se mudan a Osaka (Airbnb Nipponbashi), maletas de Yamato 18:05.",
 "Nov 7":"Osaka: desayuno en Kuromon 9:00, Den Den Town, Shitennō-ji, Tennoji Park, Abeno Harukas 15:00 y Shinsekai 16:00–19:00 (Dotonbori si hay energía).",
 "Nov 8":"Nara: Tōdai-ji 8:00, venados, Kasuga-Taisha → Osaka 12:00. Dotonbori y Hozenji Yokocho 13:30–19:00.",
 "Nov 9":"Kioto de día: Fushimi Inari 7:30, (Daigo-ji, probablemente se corta), Kyoto Ramen Koji 12:15 y teamLab Biovortex 14:30. Duermen en Osaka.",
 "Nov 10":"Día comodín en Osaka, todavía sin decidir: USJ, Himeji o tarde libre.",
 "Nov 11":"Maletas a Tokio 9:00, Shinkansen Osaka→Nagoya 11:55, escala en Nagoya y tren Shirasagi 17:30 → Kanazawa 20:30.",
 "Nov 12":"Kanazawa: Kenroku-en 9:00, Higashi Chaya (almuerzo), casa de té y centro (Katamachi).",
 "Nov 13":"Kanazawa: Nagamachi 9:00, casa samurái Nomura, mercado Ōmichō (almuerzo), Santuario Oyama, Castillo 16:40 y recorrido nocturno 18:35–20:05.",
 "Nov 14":"Shinkansen Kanazawa→Tokio 9:00, Shinjuku Gyoen, mirador del Ayuntamiento, Shinjuku y cena en Omoide Yokocho 17:00. Hotel Yoyogi Uehara.",
 "Nov 15":"Los 8 en Tokyo DisneySea todo el día (8:00–21:00).",
 "Nov 16":"Julián, Pipe y Mafalda se regresan. Los otros 5: Meiji Jingu 9:00, Yoyogi, Harajuku, ginkgos de Jingu Gaien, Shibuya 16:50 y Santuario Nogi con cena 18:50–20:20.",
 "Nov 17":"Día libre en Tokio (quedan 5: Sergio, Arley, Johan, Tati y Sebas).",
 "Nov 18":"Vuelo Haneda 12:45 → Los Ángeles.",
};

// Plan V6 (23 días, 29 oct–20 nov): versión DEFINITIVA con Osaka como base/hub.
// Ciudad = lugar principal del día (en daytrips a Kioto/Kurama se marca Kioto para el
// encuentro real con AdeS; Nov10=Kurama y Nov12=USJ tras el swap por el ticket de USJ).
const V6_CITY=[
 ["Oct 28","Tokio"],["Oct 29","Tokio"],["Oct 30","Tokio"],["Oct 31","Tokio"],["Nov 1","Tokio"],["Nov 2","Tokio"],
 ["Nov 3","Fuji"],["Nov 4","Nagano"],["Nov 5","Osaka"],["Nov 6","Kioto"],["Nov 7","Osaka"],
 ["Nov 8","Kioto"],["Nov 9","Osaka"],["Nov 10","Kioto"],["Nov 11","Osaka"],["Nov 12","Osaka"],
 ["Nov 13","Osaka"],["Nov 14","Tokio"],["Nov 15","Tokio"],["Nov 16","Tokio"],["Nov 17","Tokio"],
 ["Nov 18","Tokio"],["Nov 19","Tokio"],["Nov 20","Tokio"],
];

// Ciudades "misma región Kansai" (cercanía ≤ ~1 h)
const KANSAI=["Kioto","Osaka","Nara","Fuji","Kobe"];

// Normaliza una etiqueta de ciudad a su primer token (ignora "/", "→", espacios)
function normCity(c){ return (c||"").split(/[\/→ ]/)[0]; }

// Ventanas de encuentro con el grupo AdeS (compartidas por ambas páginas)
const OVERLAP_WINDOWS=[
 ['🟢 Tokio · 30 oct – 2 nov','30: solo yo con ellos en Senso-ji y las proyecciones (16:50–20:15); mi grupo aterriza ~19:00–20:00. 31: Halloween en Ikebukuro (13–17 h). 1: Akihabara ~17:30 y cena. 2: cena con los 4 que no van al tour de Rápido y Furioso.'],
 ['🟢 Fuji · 3 nov','Almuerzo en Kawaguchiko 13:00 y Parque Ōishi 14:00–15:00, al lado de nuestra villa.'],
 ['🟢 Kioto · 6 nov','Higashiyama de media mañana, almuerzo en Nishiki 12:00 y Gion 13:00. Ellos se van a Osaka a las 16:00.'],
 ['🟢 Osaka · 7 y 10 nov (noches)','7: noche de baile en Amerikamura después de su Shinsekai. 10: cena en Dotonbori (~20:00), la última en Kansai. El 8 (cumpleaños) y el 9 cada uno en lo suyo.'],
 ['⚪ 11–15 nov','Sin cruce: ellos en Nagoya/Kanazawa y luego DisneySea el 15. Nosotros en Osaka, USJ, Uji y Rápido y Furioso el 14.'],
 ['🟢 Tokio · 16–17 nov','16: cena en Roppongi/Nogi ~19:30. 17: compras y cena de despedida (quedan 5 de ellos). Vuelan el 18 a las 12:45.'],
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
