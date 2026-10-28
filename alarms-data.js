// ============================================================
// Alarmas del viaje — fuente ÚNICA. La usan:
//  · index.html (Centro de Control: lista + descargar .ics + Google Calendar)
//  · tools/build-ics.mjs (genera alarmas.ics para suscribirse por URL)
// Hora local de Japón (JST, UTC+9, sin horario de verano).
// a = avisos, en minutos antes del evento. dur = duración en minutos.
// ============================================================
const ALARMS=[
 {id:'llegada',d:'2026-10-28',t:'14:00',dur:90,title:'✈️ Aterrizo en Narita',where:'Narita Airport',a:[0],note:'Antes de los torniquetes: recargar la Suica física (¥5.000, efectivo) y comprar el boleto Narita Airport → Nakano con asiento N\'EX. Chuo rápido en Shinjuku, salida Norte en Nakano. Guía en Conectividad.'},
 {id:'techno-1',d:'2026-10-28',t:'23:00',dur:300,title:'🪩 Noche de techno (ZEROTOKYO / VENT / Forestlimit)',where:'Kabukicho, Shinjuku',a:[60],note:'Revisar el evento del día en ra.co. Primer tren a Nakano ~4:50.'},
 {id:'lavar',d:'2026-10-28',t:'17:30',dur:90,title:'🧺 Lavar la ropa (Nakano)',where:'Nakano, Tokyo',a:[0],note:'Preguntar al anfitrión si hay lavadora; si no, buscar コインランドリー en Maps.'},
 {id:'grupo',d:'2026-10-29',t:'21:15',dur:45,title:'👥 Recibir al grupo en Busta Shinjuku (4º piso)',where:'Busta Shinjuku, 5-24-55 Sendagaya, Shibuya, Tokyo',a:[60,15],note:'Aterrizan en Haneda T3 ~19:00–20:00 hora de Japón (CZ3085) y toman el Limousine Bus a Busta Shinjuku (¥1.400 c/u; último ~22:00). Que escriban al subirse: el bus tarda ~45 min. Luego JR Chuo rápido (快速, no 中央特快) a Nakano.'},
 {id:'flystation',d:'2026-10-29',t:'12:30',dur:90,title:'🪂 FlyStation (reservado: estar a las 12:30)',where:'FlyStation Japan, Koshigaya Laketown',a:[90,30],note:'Salir de Nakano a las 11:00: JR Chuo a Nishi-Kokubunji + JR Musashino a Koshigaya-Laketown (~1 h 15).'},
 {id:'skytree',d:'2026-10-30',t:'16:00',dur:90,title:'🗼 Tokyo Skytree',where:'Tokyo Skytree',a:[60,20],note:'Hora fijada. El grupo ya llegó (29), así que van los 5.'},
 {id:'sensoji',d:'2026-10-30',t:'18:00',dur:120,title:'🏮 Proyecciones en Senso-ji con AdeS',where:'Senso-ji, Asakusa',a:[15],note:'Gratis, 18:00–21:30. Luego Shibuya de noche y cena; a Nakano ~22:15 (teamLab mañana 08:00).'},
 {id:'planets',d:'2026-10-31',t:'08:00',dur:135,title:'🎮 teamLab Tokio (reservado: entrada 08:00–08:30)',where:'teamLab Planets Toyosu',a:[90,60],note:'Salir de Nakano 07:05 (~50 min). Llevar ropa que se pueda remangar (hay agua). Después: brunch en Toyosu Senkyaku Banrai.'},
 {id:'samurai',d:'2026-11-06',t:'14:00',dur:120,title:'🥋 Experiencia samurái (reservada)',where:'Kyoto',a:[60,20],note:'Después del almuerzo en Nishiki con AdeS. Luego Gion y Kōdai-ji iluminado.'},
 {id:'maletas-osaka',d:'2026-11-02',t:'21:00',dur:30,title:'🧳 Maletas por Yamato a Osaka (konbini en Nakano)',where:'Nakano',a:[0],note:'Entrega 5 nov, franja 19–21 h, en el Airbnb de Chuo-ku. Avisar al anfitrión. Del 3 al 5 solo mochila (Azusa mañana 07:00).'},
 {id:'azusa',d:'2026-11-03',t:'07:00',dur:60,title:'🚄 Tren Azusa Shinjuku → Ōtsuki (reservado E99391)',where:'Shinjuku Station',a:[75,30],note:'Trasbordo a la línea Fujikyu hasta Kawaguchiko (~09:15).'},
 {id:'checkout-fuji',d:'2026-11-04',t:'08:15',dur:15,title:'🏠 Check-out de la villa (límite 10:00)',where:'Fujikawaguchiko',a:[0],note:'Bus a Kōfu 08:40.'},
 {id:'kofu',d:'2026-11-04',t:'08:40',dur:75,title:'🚌 Bus Kawaguchiko → Kōfu',where:'Kawaguchiko Station',a:[20],note:'Luego Azusa a Matsumoto y Shinano a Nagano.'},
 {id:'monos',d:'2026-11-05',t:'08:15',dur:150,title:'🐒 Bus + sendero a los monos (Jigokudani)',where:'Yudanaka Station',a:[30],note:'Antes: check-out (límite 11:00) y mochilas en la recepción. Abre 9:00. Volver ~10:45.'},
 {id:'tsuruga',d:'2026-11-05',t:'16:35',dur:150,title:'🚄 Kanazawa → Tsuruga → Osaka (Thunderbird)',where:'Kanazawa Station',a:[30],note:'Las maletas llegan al Airbnb 19–21 h.'},
 {id:'keihan',d:'2026-11-06',t:'05:10',dur:70,title:'⏰ Primer metro a Yodoyabashi → Keihan a Fushimi-Inari',where:'Namba Station (Midosuji)',a:[50,15],note:'Si no alcanzas el metro: taxi a Yodoyabashi (~10 min). Keihan directo a Fushimi-Inari (~50 min). Almuerzo en Nishiki con AdeS.'},
 {id:'ultimo-kioto',d:'2026-11-06',t:'23:00',dur:30,title:'🚃 Salir de Pontocho: último tren a Osaka',where:'Gion-Shijo Station (Keihan)',a:[15,0],note:'Keihan a Yodoyabashi; el último metro a Namba sale ~24:00. Confirmar en Google Maps («último»). Taxi solo si se pierde.'},
 {id:'baile',d:'2026-11-07',t:'20:00',dur:180,title:'🕺 Noche de baile (Amerikamura) + AdeS',where:'Triangle Park, Amerikamura',a:[30],note:''},
 {id:'bday1',d:'2026-11-08',t:'00:00',dur:30,title:'🎂 Cumpleaños #1',where:'',a:[0],note:''},
 {id:'kizu',d:'2026-11-09',t:'07:00',dur:45,title:'🍱 Desayuno en el mercado Kizu',where:'Osaka Kizu Market',a:[30],note:'Luego JR a Kobe-Sannomiya y bus a Awaji (villa de Naruto).'},
 {id:'naruto',d:'2026-11-09',t:'09:00',dur:240,title:'🍥 Bus Sannomiya → Nijigen no Mori (villa de Naruto)',where:'Kobe Sannomiya Bus Terminal',a:[30],note:'~50 min, ~¥780. Abre 10:00. Volver ~13:00 para ir a Arima.'},
 {id:'maletas-sumida',d:'2026-11-13',t:'09:00',dur:30,title:'🧳 Maletas por Yamato de Osaka a Sumida',where:'Osaka (Chuo-ku)',a:[0],note:'Entrega 14 nov, franja 20–21 h, en Honjo 3-23-3 (Plan d\'Or Honjo 3F). Avisar al anfitrión.'},
 {id:'kaiyukan-ticket',d:'2026-11-01',t:'20:00',dur:15,title:'🐋 Comprar e-ticket del Kaiyukan (11 nov, 15:00)',where:'',a:[0],note:'kaiyukan.com — precio dinámico, comprar con hora.'},
 {id:'kuromon',d:'2026-11-11',t:'08:00',dur:60,title:'🍱 Desayuno en el mercado Kuromon',where:'Kuromon Market',a:[20],note:'Antes de la clase de cocina.'},
 {id:'kaiyukan',d:'2026-11-11',t:'15:00',dur:150,title:'🐋 Acuario Kaiyukan + noria de Tempozan',where:'Osaka Aquarium Kaiyukan',a:[45],note:'Última entrada 19:00. Noria al atardecer ~17:00.'},
 {id:'usj',d:'2026-11-12',t:'08:00',dur:600,title:'🎢 USJ (e-ticket reservado)',where:'Universal Studios Japan',a:[60],note:'Llegar antes de la apertura para Super Nintendo World.'},
 {id:'biovortex',d:'2026-11-13',t:'14:00',dur:60,title:'🎨 teamLab Kioto · Biovortex (reservado: entrada 14:00–14:30)',where:'teamLab Biovortex Kyoto',a:[60,20],note:'A 8 min a pie de Kioto Estación.'},
 {id:'nozomi',d:'2026-11-14',t:'09:00',dur:150,title:'🚄 Shinkansen Osaka → Tokio',where:'Shin-Osaka Station',a:[60],note:'Check-out de Osaka antes (límite 11:00). Solo mochila: las maletas llegan a Sumida 20–21 h.'},
 {id:'drift',d:'2026-11-14',t:'16:00',dur:210,title:'🏎️ Rápido y Furioso — encuentro en Ricoland Tokyo Bay',where:'RICOLAND TOKYO BAY, 2-7-12 Shinonome, Koto, Tokyo',a:[90,30],note:'Llegar 15:45. Termina 19:30. Luego check-in en Sumida (~20:15) y recibir las maletas.'},
 {id:'sumo',d:'2026-11-15',t:'17:30',dur:90,title:'🤼 Shinjuku Sumo Club (reservado)',where:'Okubo, Shinjuku',a:[60],note:''},
 {id:'torre',d:'2026-11-16',t:'16:00',dur:60,title:'🗼 Torre de Tokio al atardecer',where:'Tokyo Tower',a:[30],note:'Luego Keyakizaka y cena con AdeS cerca de Nogi.'},
 {id:'kabuki',d:'2026-11-17',t:'10:00',dur:30,title:'🎭 Comprar entrada de kabuki (un acto, mismo día)',where:'Kabuki-za, Ginza',a:[0],note:''},
 {id:'bday2',d:'2026-11-18',t:'00:00',dur:30,title:'🎂 Cumpleaños #2',where:'',a:[0],note:''},
 {id:'checkout-sumida',d:'2026-11-20',t:'09:30',dur:30,title:'🏠 Check-out en Sumida (límite 10:00)',where:'3-23-3 Honjo, Sumida, Tokyo',a:[30],note:'Keisei Access Express desde Honjo-azumabashi directo a Narita (~1 h).'},
 {id:'vuelo',d:'2026-11-20',t:'14:45',dur:60,title:'✈️ Vuelo Narita → Colombia',where:'Narita Airport',a:[240,180],note:'Llegar al aeropuerto ~11:30. Llegada a Colombia 13:00 (hora local).'},
 {id:'takao',d:'2026-11-19',t:'08:00',dur:60,title:'🍁 Keio a Takao (momiji)',where:'Shinjuku Station',a:[30],note:''},
 // --- Noches: último tren (Uber/taxi solo como último recurso) ---
 {id:'ultimo-enoshima',d:'2026-11-02',t:'21:00',dur:30,title:'🚃 Salir de Enoshima/Kamakura de vuelta a Tokio',where:'Enoshima',a:[15],note:'Odakyu o JR; ~1 h a Shinjuku.'},
 {id:'ultimo-kioto-bday',d:'2026-11-08',t:'23:00',dur:30,title:'🚃 Último tren Kioto → Osaka (cumpleaños)',where:'Gion-Shijo Station (Keihan)',a:[15,0],note:'Keihan a Yodoyabashi + metro a Namba (~24:00).'},
 {id:'ultimo-kobe',d:'2026-11-09',t:'23:00',dur:30,title:'🚃 Último JR Sannomiya → Osaka',where:'Sannomiya Station',a:[15,0],note:'Confirmar en Google Maps («último»).'},
 {id:'ultimo-kurama',d:'2026-11-10',t:'20:30',dur:30,title:'🚃 Último tren Eizan desde Kurama (confirmar hora)',where:'Kurama Station',a:[30,10],note:'Después del onsen. Luego Keihan desde Demachiyanagi.'},
 {id:'ultimo-nabana',d:'2026-11-13',t:'19:30',dur:30,title:'🚃 Si fuiste a Nabana: salir hacia Kintetsu Nagoya',where:'Nabana no Sato',a:[15],note:'Último expreso a Osaka-Namba: confirmar en Google Maps.'},
 {id:'ultimo-golden',d:'2026-11-15',t:'23:30',dur:30,title:'🚃 Último tren Shinjuku → Sumida',where:'Shinjuku Station',a:[15,0],note:'~35 min hasta Sumida. Confirmar en Google Maps.'},
 // --- Noches de discoteca: volver en el primer tren ---
 {id:'club-1',d:'2026-11-01',t:'04:50',dur:30,title:'🪩 Primer tren a casa (Halloween)',where:'Shibuya Station',a:[0],note:'Mañana libre para dormir: Meiji Jingu ~12:45.'},
 {id:'club-2',d:'2026-11-08',t:'04:50',dur:30,title:'🪩 Primer metro a casa (Amerikamura)',where:'Shinsaibashi',a:[0],note:'Cumpleaños: Arashiyama ~9:00.'},
 {id:'club-3',d:'2026-11-14',t:'04:50',dur:30,title:'🪩 Primer metro a casa (Osaka)',where:'Shinsaibashi',a:[0],note:'Shinkansen 9:00: dormir en el tren.'},
 {id:'club-4',d:'2026-11-15',t:'04:50',dur:30,title:'🪩 Primer tren a casa (Tokio)',where:'Ginza / Shibuya',a:[0],note:'Mañana de recuperación; Meiji a las 11:00.'},
 // Despertar con el grupo (5 personas, 1 baño). Calculado con ducha la noche anterior: ~8 min de baño c/u,
 // primero los hombres; maquillaje y peinado fuera del baño. Si se duchan en la mañana, restar 30 min.
 {id:'wake-30oct',d:'2026-10-30',t:'08:30',dur:15,title:'⏰ Despertar (salir 09:30 · Skytree 16:00)',where:'Nakano',a:[0],note:'Turnos de baño de ~8 min. Si se duchan en la mañana: 08:00.'},
 {id:'wake-31oct',d:'2026-10-31',t:'06:00',dur:15,title:'⏰ Despertar (salir 07:05 · teamLab 08:00)',where:'Nakano',a:[0],note:'Ducharse la noche del 30. Si se duchan en la mañana: 05:30.'},
 {id:'wake-2nov',d:'2026-11-02',t:'05:30',dur:15,title:'⏰ Despertar (salir 06:30 · Kamakura)',where:'Nakano',a:[0],note:'Si se duchan en la mañana: 05:00.'},
 {id:'wake-3nov',d:'2026-11-03',t:'05:15',dur:15,title:'⏰ Despertar (check-out 06:15 · Azusa 07:00)',where:'Nakano',a:[0],note:'Mochilas hechas la noche del 2. Estar en el andén de Shinjuku a las 06:50. Si se duchan en la mañana: 04:45.'},
 {id:'wake-4nov',d:'2026-11-04',t:'07:15',dur:15,title:'⏰ Despertar (check-out 08:15 · bus 08:40)',where:'Fujikawaguchiko',a:[0],note:'Para ver el Fuji al amanecer: 05:45.'},
 {id:'wake-5nov',d:'2026-11-05',t:'06:15',dur:15,title:'⏰ Despertar (desayuno del ryokan 06:45)',where:'Yudanaka',a:[0],note:'Bañarse en el onsen en vez de ducharse.'},
 {id:'wake-6nov',d:'2026-11-06',t:'04:10',dur:15,title:'⏰ Despertar (salir 05:10 · Fushimi Inari)',where:'Osaka (Chuo-ku)',a:[0],note:'Ducha obligatoria la noche del 5 y ropa lista. Plan B si están muy cansados: salir 07:00 (el samurái es a las 14:00).'},
 {id:'wake-7nov',d:'2026-11-07',t:'06:45',dur:15,title:'⏰ Despertar (salir 07:45 · Himeji)',where:'Osaka (Chuo-ku)',a:[0],note:'Si se duchan en la mañana: 06:15.'},
 {id:'wake-8nov',d:'2026-11-08',t:'07:00',dur:15,title:'⏰ Despertar 🎂 (salir 08:00 · Arashiyama)',where:'Osaka (Chuo-ku)',a:[0],note:'Vienen de la discoteca (~05:10): ducharse al llegar y dejar la ropa lista antes de salir el 7.'},
 {id:'wake-9nov',d:'2026-11-09',t:'05:40',dur:15,title:'⏰ Despertar (salir 06:40 · Kizu → Naruto)',where:'Osaka (Chuo-ku)',a:[0],note:'Llevar pasaporte. Si se duchan en la mañana: 05:10.'},
 {id:'wake-10nov',d:'2026-11-10',t:'06:30',dur:15,title:'⏰ Despertar (salir 07:30 · Kurama)',where:'Osaka (Chuo-ku)',a:[0],note:'Si se duchan en la mañana: 06:00.'},
 {id:'wake-11nov',d:'2026-11-11',t:'06:45',dur:15,title:'⏰ Despertar (salir 07:45 · Kuromon + cocina 09:30)',where:'Osaka (Chuo-ku)',a:[0],note:'Si se duchan en la mañana: 06:15.'},
 {id:'wake-12nov',d:'2026-11-12',t:'06:15',dur:15,title:'⏰ Despertar (salir 07:15 · USJ)',where:'Osaka (Chuo-ku)',a:[0],note:'Si se duchan en la mañana: 05:45.'},
 {id:'wake-13nov',d:'2026-11-13',t:'07:30',dur:15,title:'⏰ Despertar (maletas Yamato 08:30 · teamLab 14:00)',where:'Osaka (Chuo-ku)',a:[0],note:'Maletas cerradas la noche del 12. Si se duchan en la mañana: 07:00.'},
 {id:'wake-14nov',d:'2026-11-14',t:'07:00',dur:15,title:'⏰ Despertar (check-out 07:45 · shinkansen 09:00)',where:'Osaka (Chuo-ku)',a:[0],note:'Vienen de la discoteca (~05:10): ducharse al llegar y dejar las mochilas hechas antes de salir el 13.'},
 {id:'wake-15nov',d:'2026-11-15',t:'09:15',dur:15,title:'⏰ Despertar (salir 10:15 · sumo 17:30)',where:'Sumida',a:[0],note:'Si se duchan en la mañana: 08:45.'},
 {id:'wake-18nov',d:'2026-11-18',t:'06:30',dur:15,title:'⏰ Despertar 🎂 (salir 07:30 · Tsukiji)',where:'Sumida',a:[0],note:'Si se duchan en la mañana: 06:00.'},
 {id:'wake-19nov',d:'2026-11-19',t:'06:00',dur:15,title:'⏰ Despertar (salir 07:00 · Takao)',where:'Sumida',a:[0],note:'Si se duchan en la mañana: 05:30.'},
 {id:'wake-20nov',d:'2026-11-20',t:'07:30',dur:15,title:'⏰ Despertar (check-out 09:00 · vuelo 14:45)',where:'Sumida',a:[0],note:'Maletas hechas la noche del 19. Si se duchan en la mañana: 07:00.'},
];

// Genera un calendario .ics (los horarios se convierten de JST a UTC).
function buildICS(list){
  const pad=n=>String(n).padStart(2,'0');
  const utc=(d,t,addMin)=>{
    const [Y,M,D]=d.split('-').map(Number),[h,m]=t.split(':').map(Number);
    const x=new Date(Date.UTC(Y,M-1,D,h-9,m+(addMin||0)));
    return `${x.getUTCFullYear()}${pad(x.getUTCMonth()+1)}${pad(x.getUTCDate())}T${pad(x.getUTCHours())}${pad(x.getUTCMinutes())}00Z`;
  };
  const esc=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/([,;])/g,'\\$1');
  const L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//japantrip//alarmas//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Japón 2026 · Alarmas','X-WR-TIMEZONE:Asia/Tokyo'];
  list.forEach(e=>{
    L.push('BEGIN:VEVENT',`UID:${e.id}@japantrip`,`DTSTAMP:${utc('2026-10-27','12:00')}`,
      `DTSTART:${utc(e.d,e.t)}`,`DTEND:${utc(e.d,e.t,e.dur)}`,`SUMMARY:${esc(e.title)}`);
    if(e.where)L.push(`LOCATION:${esc(e.where)}`);
    if(e.note)L.push(`DESCRIPTION:${esc(e.note)}`);
    (e.a||[]).forEach(m=>L.push('BEGIN:VALARM','ACTION:DISPLAY',`DESCRIPTION:${esc(e.title)}`,`TRIGGER:-PT${m}M`,'END:VALARM'));
    L.push('END:VEVENT');
  });
  L.push('END:VCALENDAR');
  return L.join('\r\n')+'\r\n';
}

// Link de "agregar a Google Calendar" para un evento suelto.
function gcalLink(e){
  const ics=buildICS([e]);
  const s=ics.match(/DTSTART:(\S+)/)[1], en=ics.match(/DTEND:(\S+)/)[1];
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(e.title)+
    '&dates='+s+'/'+en+'&details='+encodeURIComponent(e.note||'')+'&location='+encodeURIComponent(e.where||'')+'&ctz=Asia/Tokyo';
}

if(typeof module!=='undefined')module.exports={ALARMS,buildICS};
