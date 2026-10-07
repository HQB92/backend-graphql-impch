import { test, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import * as baptismService from '../../services/sectorBaptismRecord.service';
import * as merriageService from '../../services/sectorMerriageRecord.service';
import * as churchService from '../../services/sectorChurch.service';
import baptismResolvers from './sectorBaptismRecord.resolver';
import merriageResolvers from './sectorMerriageRecord.resolver';
import churchResolvers from './sectorChurch.resolver';

// Los resolvers registran en consola; se silencia para dejar limpia la salida.
beforeEach(() => {
    mock.method(console, 'log', () => undefined);
    mock.method(console, 'error', () => undefined);
});
afterEach(() => mock.restoreAll());

type Resolver = (parent: any, args: any, context: any) => Promise<unknown>;

interface Entry {
    name: string;
    resolver: Resolver;
    service: any;
    method: string;
}

const entry = (name: string, resolver: unknown, service: any, method: string): Entry =>
    ({ name, resolver: resolver as Resolver, service, method });

const ENTRIES: Entry[] = [
    entry('SectorBaptismRecord.getAll', baptismResolvers.SectorBaptismRecordQuery.getAll, baptismService, 'getAllSectorBaptisms'),
    entry('SectorBaptismRecord.getById', baptismResolvers.SectorBaptismRecordQuery.getById, baptismService, 'getSectorBaptismById'),
    entry('SectorBaptismRecord.count', baptismResolvers.SectorBaptismRecordQuery.count, baptismService, 'countSectorBaptisms'),
    entry('SectorBaptismRecord.create', baptismResolvers.SectorBaptismRecordMutation.create, baptismService, 'createSectorBaptism'),
    entry('SectorBaptismRecord.update', baptismResolvers.SectorBaptismRecordMutation.update, baptismService, 'updateSectorBaptism'),
    entry('SectorBaptismRecord.delete', baptismResolvers.SectorBaptismRecordMutation.delete, baptismService, 'deleteSectorBaptism'),
    entry('SectorMerriageRecord.getAll', merriageResolvers.SectorMerriageRecordQuery.getAll, merriageService, 'getAllSectorMerriages'),
    entry('SectorMerriageRecord.getById', merriageResolvers.SectorMerriageRecordQuery.getById, merriageService, 'getSectorMerriageById'),
    entry('SectorMerriageRecord.count', merriageResolvers.SectorMerriageRecordQuery.count, merriageService, 'countSectorMerriages'),
    entry('SectorMerriageRecord.create', merriageResolvers.SectorMerriageRecordMutation.create, merriageService, 'createSectorMerriage'),
    entry('SectorMerriageRecord.update', merriageResolvers.SectorMerriageRecordMutation.update, merriageService, 'updateSectorMerriage'),
    entry('SectorMerriageRecord.delete', merriageResolvers.SectorMerriageRecordMutation.delete, merriageService, 'deleteSectorMerriage'),
    entry('SectorChurch.getAll', churchResolvers.SectorChurchQuery.getAll, churchService, 'getAllSectorChurches'),
    entry('SectorChurch.me', churchResolvers.SectorChurchQuery.me, churchService, 'getSectorChurchById'),
    entry('SectorChurch.updateProfile', churchResolvers.SectorChurchMutation.updateProfile, churchService, 'updateSectorChurchProfile'),
    entry('SectorChurch.changePassword', churchResolvers.SectorChurchMutation.changePassword, churchService, 'changeSectorChurchPassword'),
];

const byName = (name: string): Entry => {
    const found = ENTRIES.find((e) => e.name === name);
    assert.ok(found, `resolver ${name} no encontrado`);
    return found;
};

const mockService = (e: Entry) => mock.method(e.service, e.method, async () => 'ok' as any);

const secretario = { userId: 5, username: 's', roles: ['Secretario'] };
const admin = { userId: 1, username: 'a', roles: ['Administrador'] };
const pastor = (sectorChurchId?: number) => ({ userId: 7, username: 'p', roles: ['PastorSector'], sectorChurchId });

const call = (e: Entry, user: any, parent: any = {}) => e.resolver(parent, {}, { user });

const assertRejected = async (e: Entry, user: any, message = 'No autorizado', parent: any = {}) => {
    const spy = mockService(e);
    await assert.rejects(() => call(e, user, parent), { message }, e.name);
    assert.equal(spy.mock.callCount(), 0, `${e.name} no debe llamar al servicio`);
};

test('hay 16 resolvers de sector bajo prueba', () => {
    assert.equal(ENTRIES.length, 16);
});

for (const e of ENTRIES) {
    test(`${e.name}: un Secretario es rechazado y no se llama al servicio`, async () => {
        await assertRejected(e, secretario);
    });

    test(`${e.name}: un PastorSector sin sectorChurchId es rechazado`, async () => {
        await assertRejected(e, pastor(undefined));
    });

    test(`${e.name}: sin usuario es rechazado`, async () => {
        await assertRejected(e, undefined, 'You are not authenticated!');
    });
}

for (const name of [
    'SectorBaptismRecord.create',
    'SectorMerriageRecord.create',
    'SectorChurch.me',
    'SectorChurch.updateProfile',
    'SectorChurch.changePassword',
]) {
    test(`${name}: un Administrador es rechazado`, async () => {
        await assertRejected(byName(name), admin);
    });
}

test('SectorChurch.getAll: un PastorSector es rechazado', async () => {
    await assertRejected(byName('SectorChurch.getAll'), pastor(3));
});

for (const name of ['SectorBaptismRecord.getAll', 'SectorMerriageRecord.getAll']) {
    test(`${name}: el pastor siempre usa su propia iglesia aunque pida otra`, async () => {
        const e = byName(name);
        const spy = mockService(e);

        await call(e, pastor(3), { sectorChurchId: 9 });

        assert.deepEqual(spy.mock.calls[0].arguments, [3]);
    });
}
