import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import SectorMerriageRecord from '../db/models/sectorMerriageRecord.model';
import {
    countSectorMerriages,
    createSectorMerriage,
    deleteSectorMerriage,
    getAllSectorMerriages,
    getSectorMerriageById,
    updateSectorMerriage,
} from './sectorMerriageRecord.service';

afterEach(() => mock.restoreAll());

const valid = () => ({
    husbandId: '15.111.222-3',
    fullNameHusband: 'Pedro Soto',
    wifeId: '16.111.222-3',
    fullNameWife: 'Marta Díaz',
    civilCode: 45,
    civilDate: new Date('2026-08-01T12:00:00'),
    civilPlace: 'Bulnes',
    religiousDate: new Date('2026-08-15T12:00:00'),
});

const whereOf = (call: { arguments: unknown[] }, index = 0) => (call.arguments[index] as any).where;

test('listar y contar filtran por la iglesia del alcance', async () => {
    const findAll = mock.method(SectorMerriageRecord, 'findAll', async () => []);
    const count = mock.method(SectorMerriageRecord, 'count', async () => 0);

    await getAllSectorMerriages(3);
    await countSectorMerriages(3);

    assert.deepEqual(whereOf(findAll.mock.calls[0]), { deleted: false, sectorChurchId: 3 });
    assert.deepEqual(whereOf(count.mock.calls[0]), { deleted: false, sectorChurchId: 3 });
});

test('sin alcance (administrador) no se filtra por iglesia', async () => {
    const findAll = mock.method(SectorMerriageRecord, 'findAll', async () => []);

    await getAllSectorMerriages(undefined);

    assert.deepEqual(whereOf(findAll.mock.calls[0]), { deleted: false });
});

test('leer por id busca por id y por iglesia', async () => {
    const findOne = mock.method(SectorMerriageRecord, 'findOne', async () => null);

    assert.equal(await getSectorMerriageById('5', 3), null);
    assert.deepEqual(whereOf(findOne.mock.calls[0]), { id: 5, deleted: false, sectorChurchId: 3 });
});

test('editar un registro de otra iglesia devuelve 404 y no modifica nada', async () => {
    const update = mock.method(SectorMerriageRecord, 'update', async () => [0]);

    const response = await updateSectorMerriage(5, valid(), 3);

    assert.deepEqual(response, { code: 404, message: 'Registro no encontrado' });
    assert.deepEqual(whereOf(update.mock.calls[0], 1), { id: 5, deleted: false, sectorChurchId: 3 });
});

test('eliminar un registro de otra iglesia devuelve 404', async () => {
    const update = mock.method(SectorMerriageRecord, 'update', async () => [0]);

    const response = await deleteSectorMerriage(5, 3);

    assert.deepEqual(response, { code: 404, message: 'Registro no encontrado' });
    assert.deepEqual(update.mock.calls[0].arguments[0], { deleted: true });
    assert.deepEqual(whereOf(update.mock.calls[0], 1), { id: 5, deleted: false, sectorChurchId: 3 });
});

test('un id que no es un entero positivo devuelve 404 sin consultar la base', async () => {
    const findOne = mock.method(SectorMerriageRecord, 'findOne', async () => null);
    const update = mock.method(SectorMerriageRecord, 'update', async () => [1]);

    for (const id of ['abc', 0, -1, undefined, null]) {
        assert.equal((await updateSectorMerriage(id, valid(), 3)).code, 404);
        assert.equal((await deleteSectorMerriage(id, 3)).code, 404);
        assert.equal(await getSectorMerriageById(id, 3), null);
    }
    assert.equal(findOne.mock.callCount(), 0);
    assert.equal(update.mock.callCount(), 0);
});

test('crear guarda con la iglesia indicada e ignora campos que no son del matrimonio', async () => {
    const create = mock.method(SectorMerriageRecord, 'create', async () => ({}) as any);

    const response = await createSectorMerriage({ ...valid(), sectorChurchId: 9, deleted: true, id: 77 }, 3);

    assert.equal(response.code, 201);
    const saved = create.mock.calls[0].arguments[0] as any;
    assert.equal(saved.sectorChurchId, 3);
    assert.equal(saved.civilCode, 45);
    assert.equal('deleted' in saved, false);
    assert.equal('id' in saved, false);
});

test('crear con un campo obligatorio vacío devuelve 400 y no inserta', async () => {
    const create = mock.method(SectorMerriageRecord, 'create', async () => ({}) as any);

    const sinFecha = await createSectorMerriage({ ...valid(), religiousDate: null }, 3);
    const sinEsposa = await createSectorMerriage({ ...valid(), fullNameWife: '  ' }, 3);
    const sinDatos = await createSectorMerriage(undefined, 3);

    assert.deepEqual(sinFecha, { code: 400, message: 'Campo requerido faltante: religiousDate' });
    assert.deepEqual(sinEsposa, { code: 400, message: 'Campo requerido faltante: fullNameWife' });
    assert.equal(sinDatos.code, 400);
    assert.equal(create.mock.callCount(), 0);
});

test('el número de registro debe ser un entero positivo; cero no cuenta como vacío válido', async () => {
    const create = mock.method(SectorMerriageRecord, 'create', async () => ({}) as any);

    for (const civilCode of [0, -4, 1.5, NaN, null, undefined, 'abc']) {
        const response = await createSectorMerriage({ ...valid(), civilCode }, 3);
        assert.deepEqual(response, { code: 400, message: 'Campo requerido faltante: civilCode' });
    }
    assert.equal(create.mock.callCount(), 0);
});

test('editar un registro propio lo actualiza sin cambiar su iglesia', async () => {
    const update = mock.method(SectorMerriageRecord, 'update', async () => [1]);

    const response = await updateSectorMerriage(5, { ...valid(), civilPlace: 'Chillán', sectorChurchId: 9 }, 3);

    assert.equal(response.code, 200);
    const saved = update.mock.calls[0].arguments[0] as any;
    assert.equal(saved.civilPlace, 'Chillán');
    assert.equal('sectorChurchId' in saved, false);
});
