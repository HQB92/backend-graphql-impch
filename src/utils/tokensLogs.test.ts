import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateContext, sectorScope, isSectorPastor } from './tokensLogs';

const pastor = { username: 'Bulnes', roles: ['PastorSector'], sectorChurchId: 3 };
const admin = { username: 'hugo', roles: ['Administrador'] };
const secretario = { username: 'camila', roles: ['Secretario'] };

const EXISTING_SERVICES = [
    'Attendance', 'Bank', 'BaptismRecord', 'Church', 'Expense', 'Inventory',
    'Member', 'MerriageRecord', 'Offering', 'Rehearsal', 'Status', 'User',
];
const SECTOR_SERVICES = ['SectorBaptismRecord', 'SectorMerriageRecord', 'SectorChurch'];

test('sin usuario no hay acceso a ningún servicio', () => {
    for (const service of [...EXISTING_SERVICES, ...SECTOR_SERVICES]) {
        assert.throws(() => validateContext(undefined, service), /not authenticated/);
    }
});

test('un pastor de sector es rechazado en todos los servicios existentes', () => {
    for (const service of EXISTING_SERVICES) {
        assert.throws(() => validateContext(pastor, service), /No autorizado/, service);
    }
});

test('un pastor de sector entra a los tres servicios de sector', () => {
    for (const service of SECTOR_SERVICES) {
        assert.doesNotThrow(() => validateContext(pastor, service), service);
    }
});

test('el administrador entra a todos los servicios', () => {
    for (const service of [...EXISTING_SERVICES, ...SECTOR_SERVICES]) {
        assert.doesNotThrow(() => validateContext(admin, service), service);
    }
});

test('un rol de Zañartu que no es administrador no entra a los servicios de sector', () => {
    for (const service of SECTOR_SERVICES) {
        assert.throws(() => validateContext(secretario, service), /No autorizado/, service);
    }
    for (const service of EXISTING_SERVICES) {
        assert.doesNotThrow(() => validateContext(secretario, service), service);
    }
});

test('isSectorPastor solo es verdadero con el rol PastorSector', () => {
    assert.equal(isSectorPastor(pastor), true);
    assert.equal(isSectorPastor(admin), false);
    assert.equal(isSectorPastor(undefined), false);
    assert.equal(isSectorPastor({ roles: 'PastorSector' }), false);
});

test('un pastor siempre obtiene su propia iglesia aunque pida otra', () => {
    assert.equal(sectorScope(pastor), 3);
    assert.equal(sectorScope(pastor, 7), 3);
    assert.equal(sectorScope(pastor, '7'), 3);
    assert.equal(sectorScope(pastor, null), 3);
});

test('el administrador obtiene la iglesia pedida o todas', () => {
    assert.equal(sectorScope(admin), undefined);
    assert.equal(sectorScope(admin, null), undefined);
    assert.equal(sectorScope(admin, 7), 7);
    assert.equal(sectorScope(admin, '7'), 7);
});

test('el administrador con un filtro inválido no obtiene todas las iglesias por accidente', () => {
    assert.throws(() => sectorScope(admin, 'abc'), /No autorizado/);
    assert.throws(() => sectorScope(admin, -1), /No autorizado/);
});

test('un rol PastorSector sin sectorChurchId es rechazado', () => {
    const mal = { username: 'camila', roles: ['Secretario', 'PastorSector'] };
    assert.throws(() => sectorScope(mal), /No autorizado/);
    assert.throws(() => sectorScope({ roles: ['PastorSector'], sectorChurchId: 0 }), /No autorizado/);
    assert.throws(() => sectorScope({ roles: ['PastorSector'], sectorChurchId: 'x' }), /No autorizado/);
});

test('Administrador y PastorSector a la vez se trata como pastor: la regla más restrictiva', () => {
    const ambos = { roles: ['Administrador', 'PastorSector'], sectorChurchId: 3 };
    assert.throws(() => validateContext(ambos, 'Offering'), /No autorizado/);
    assert.equal(sectorScope(ambos, 7), 3);
    assert.throws(() => sectorScope({ roles: ['Administrador', 'PastorSector'] }), /No autorizado/);
});

test('otros roles no tienen alcance de sector', () => {
    assert.throws(() => sectorScope(secretario), /No autorizado/);
    assert.throws(() => sectorScope(undefined), /No autorizado/);
});
