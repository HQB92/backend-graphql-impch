'use strict';

// Genera una clave al azar por iglesia del sector.
// Escribe los hashes en el seeder (se versiona) y las claves en texto plano
// en el archivo indicado, que debe estar fuera del repositorio.
//
// Uso: node scripts/generate-sector-seed.js <ruta-archivo-claves>

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const CHURCHES = [
  'San Fabián',
  'Coihueco',
  'San Carlos',
  'San Nicolás',
  'El Carmen',
  'Pueblo Seco',
  'Tres Esquinas',
  'Bulnes',
  'San Miguel',
  'San Ignacio',
];

// Sin caracteres que se confunden al leerlos o dictarlos (0/O, 1/I/L).
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const randomPassword = () => {
  const groups = [];
  for (let g = 0; g < 3; g++) {
    let group = '';
    for (let i = 0; i < 4; i++) {
      group += ALPHABET[crypto.randomInt(ALPHABET.length)];
    }
    groups.push(group);
  }
  return groups.join('-');
};

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const outArg = process.argv[2];
if (!outArg) fail('Uso: node scripts/generate-sector-seed.js <ruta-archivo-claves>');

const repoRoot = path.resolve(__dirname, '..');
const outFile = path.resolve(outArg);
const seederFile = path.join(repoRoot, 'src', 'db', 'seeders', '20261007000004-seed-sector-churches.js');

if (outFile === repoRoot || outFile.startsWith(repoRoot + path.sep)) {
  fail('El archivo de claves debe quedar fuera del repositorio.');
}
if (fs.existsSync(outFile)) {
  fail(`Ya existe ${outFile}. No se sobrescribe: bórralo a mano si quieres regenerar las claves.`);
}
if (fs.existsSync(seederFile)) {
  fail(`Ya existe ${seederFile}. Regenerarlo dejaría claves entregadas que ya no sirven.`);
}

const entries = CHURCHES.map((name) => {
  const password = randomPassword();
  return { name, password, hash: bcrypt.hashSync(password, 10) };
});

const seeder = `'use strict';

// Generado por scripts/generate-sector-seed.js. Contiene solo hashes bcrypt.

const CHURCHES = [
${entries.map((e) => `  { name: ${JSON.stringify(e.name)}, password: ${JSON.stringify(e.hash)} },`).join('\n')}
];

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    await queryInterface.bulkInsert(
      'SectorChurches',
      CHURCHES.map((church) => ({ ...church, createdAt: now, updatedAt: now })),
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('SectorChurches', { name: CHURCHES.map((church) => church.name) }, {});
  }
};
`;

const width = Math.max(...entries.map((e) => e.name.length));
const plain = [
  'Claves iniciales de las iglesias del sector',
  `Generadas: ${new Date().toISOString()}`,
  'Cada pastor puede cambiar la suya en Mi Perfil.',
  '',
  ...entries.map((e) => `${e.name.padEnd(width)}  ${e.password}`),
  '',
].join('\n');

fs.writeFileSync(seederFile, seeder);
fs.writeFileSync(outFile, plain, { mode: 0o600 });

console.log(`Seeder escrito en ${seederFile}`);
console.log(`Claves escritas en ${outFile}`);
