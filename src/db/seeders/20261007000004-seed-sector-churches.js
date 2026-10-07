'use strict';

// Generado por scripts/generate-sector-seed.js. Contiene solo hashes bcrypt.

const CHURCHES = [
  { name: "San Fabián", password: "$2b$10$JwLAr8O9sGtEMvbGgVvm6er6/0/EDMcS/nRC6q/PB9eU25mnzwaHi" },
  { name: "Coihueco", password: "$2b$10$McPhlyb0BzMPgYlIDIyOi.cllRCkd/uypzCfBIzok1g9klinLGGwO" },
  { name: "San Carlos", password: "$2b$10$usNm9Ez9MwCJ57lO8dhj7OFxzIlVkk.1vl2hdc593MsIsEcO3RgHq" },
  { name: "San Nicolás", password: "$2b$10$Ynni0WX6RoyrqRHhKeXu.u2KmATjUUVYd33W7Zn.I9mQkXIeiw6gm" },
  { name: "El Carmen", password: "$2b$10$Qh8Ba4ynF8P5/oTNWTmoJOaAhndKMoBqfdAYdSIlcoHMyUIYSJP2W" },
  { name: "Pueblo Seco", password: "$2b$10$rlzKJsXL2PG.b86hYy1oHOXL6CKSkSkvxZNPwtFxhnLFAi9fLH4wC" },
  { name: "Tres Esquinas", password: "$2b$10$C5rFJ03QHLFkbgHKN/yjweIAQmgPZSIxY0STDwQm8qYWPlukmT6SW" },
  { name: "Bulnes", password: "$2b$10$BW0yNIgdQpXSpZJvlQCe4OK5FfkGz7n/9XFXZ.xQu9oA9ap0GTioi" },
  { name: "San Miguel", password: "$2b$10$tmiqOF.W80gyskJgdXg9kuQ9hCjIFR2wwtNJ6MUA5A6kNyLUeBJbK" },
  { name: "San Ignacio", password: "$2b$10$aj29aCP28jMFl3xYRXOdTuKccwNBDpee7K6OwKBrxJQSF5knUECnG" },
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
