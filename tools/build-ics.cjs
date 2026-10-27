// Regenera alarmas.ics (calendario para suscribirse por URL) desde alarms-data.js.
// Uso: node tools/build-ics.cjs
const fs = require('fs');
const path = require('path');
const { ALARMS, buildICS } = require('../alarms-data.js');
const out = path.join(__dirname, '..', 'alarmas.ics');
fs.writeFileSync(out, buildICS(ALARMS));
console.log(`alarmas.ics: ${ALARMS.length} eventos`);
