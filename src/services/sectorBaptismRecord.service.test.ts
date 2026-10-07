import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import SectorBaptismRecord from '../db/models/sectorBaptismRecord.model';
import {
    countSectorBaptisms,
    createSectorBaptism,
    deleteSectorBaptism,
    getAllSectorBaptisms,
    getSectorBaptismById,
    updateSectorBaptism,
} from './sectorBaptismRecord.service';

afterEach(() => mock.restoreAll());

const valid = () => ({
    childRUT: '25.111.222-3',
    childFullName: 'Ana Soto',
    childDateOfBirth: new Date('2024-01-10T12:00:00'),
    fatherRUT: '',
    fatherFullName: '',
    motherRUT: '15.111.222-3',
    motherFullName: 'María Soto',
    placeOfRegistration: 'Bulnes',
    baptismDate: new Date('2026-09-20T12:00:00'),
    registrationNumber: '123',
    registrationDate: new Date('2024-01-15T12:00:00'),
});

const whereOf = (call: { arguments: unknown[] }, index = 0) => (call.arguments[index] as any).where;

test('listar y contar filtran por la iglesia del alcance', async () => {
    const findAll = mock.method(SectorBaptismRecord, 'findAll', async () => []);
    const count = mock.method(SectorBaptismRecord, 'count', async () => 0);

    await getAllSectorBaptisms(3);
    await countSectorBaptisms(3);

    assert.deepEqual(whereOf(findAll.mock.calls[0]), { deleted: false, sectorChurchId: 3 });
    assert.deepEqual(whereOf(count.mock.calls[0]), { deleted: false, sectorChurchId: 3 });
});

test('sin alcance (administrador) no se filtra por iglesia', async () => {
    const findAll = mock.method(SectorBaptismRecord, 'findAll', async () => []);

    await getAllSectorBaptisms(undefined);

    assert.deepEqual(whereOf(findAll.mock.calls[0]), { deleted: false });
});

test('leer por id busca por id y por iglesia', async () => {
    const findOne = mock.method(SectorBaptismRecord, 'findOne', async () => null);

    assert.equal(await getSectorBaptismById('5', 3), null);
    assert.deepEqual(whereOf(findOne.mock.calls[0]), { id: 5, deleted: false, sectorChurchId: 3 });
});

test('editar un registro de otra iglesia devuelve 404 y no modifica nada', async () => {
    const findOne = mock.method(SectorBaptismRecord, 'findOne', async () => null);
    const update = mock.method(SectorBaptismRecord, 'update', async () => [0]);

    const response = await updateSectorBaptism(5, valid(), 3);

    assert.deepEqual(response, { code: 404, message: 'Registro no encontrado' });
    assert.deepEqual(whereOf(findOne.mock.calls[0]), { id: 5, deleted: false, sectorChurchId: 3 });
    assert.equal(update.mock.callCount(), 0);
});

test('eliminar un registro de otra iglesia devuelve 404', async () => {
    const update = mock.method(SectorBaptismRecord, 'update', async () => [0]);

    const response = await deleteSectorBaptism(5, 3);

    assert.deepEqual(response, { code: 404, message: 'Registro no encontrado' });
    assert.deepEqual(update.mock.calls[0].arguments[0], { deleted: true });
    assert.deepEqual(whereOf(update.mock.calls[0], 1), { id: 5, deleted: false, sectorChurchId: 3 });
});

test('un id que no es un entero positivo devuelve 404 sin consultar la base', async () => {
    const findOne = mock.method(SectorBaptismRecord, 'findOne', async () => null);
    const update = mock.method(SectorBaptismRecord, 'update', async () => [1]);

    for (const id of ['abc', 0, -1, undefined, null, '5; DROP']) {
        assert.equal((await updateSectorBaptism(id, valid(), 3)).code, 404);
        assert.equal((await deleteSectorBaptism(id, 3)).code, 404);
        assert.equal(await getSectorBaptismById(id, 3), null);
    }
    assert.equal(findOne.mock.callCount(), 0);
    assert.equal(update.mock.callCount(), 0);
});

test('crear guarda con la iglesia indicada e ignora campos que no son del bautizo', async () => {
    mock.method(SectorBaptismRecord, 'findOne', async () => null);
    const create = mock.method(SectorBaptismRecord, 'create', async () => ({}) as any);

    const response = await createSectorBaptism({ ...valid(), sectorChurchId: 9, deleted: true, id: 77 }, 3);

    assert.equal(response.code, 201);
    const saved = create.mock.calls[0].arguments[0] as any;
    assert.equal(saved.sectorChurchId, 3);
    assert.equal('deleted' in saved, false);
    assert.equal('id' in saved, false);
    assert.equal(saved.fatherRUT, null);
    assert.equal(saved.fatherFullName, null);
});

test('crear con un campo obligatorio vacío devuelve 400 y no inserta', async () => {
    const findOne = mock.method(SectorBaptismRecord, 'findOne', async () => null);
    const create = mock.method(SectorBaptismRecord, 'create', async () => ({}) as any);

    const sinFecha = await createSectorBaptism({ ...valid(), baptismDate: null }, 3);
    const sinMadre = await createSectorBaptism({ ...valid(), motherRUT: '   ' }, 3);
    const sinDatos = await createSectorBaptism(undefined, 3);

    assert.deepEqual(sinFecha, { code: 400, message: 'Campo requerido faltante: baptismDate' });
    assert.deepEqual(sinMadre, { code: 400, message: 'Campo requerido faltante: motherRUT' });
    assert.equal(sinDatos.code, 400);
    assert.equal(findOne.mock.callCount(), 0);
    assert.equal(create.mock.callCount(), 0);
});

test('crear un RUT que ya tiene bautizo activo en el sector devuelve 400', async () => {
    const findOne = mock.method(SectorBaptismRecord, 'findOne', async () => ({ id: 1 }) as any);
    const create = mock.method(SectorBaptismRecord, 'create', async () => ({}) as any);

    const response = await createSectorBaptism(valid(), 3);

    assert.deepEqual(response, { code: 400, message: 'Registro de bautizo ya existe para este RUT' });
    // La búsqueda de duplicados es en todo el sector, no solo en la iglesia.
    assert.deepEqual(whereOf(findOne.mock.calls[0]), { childRUT: '25.111.222-3', deleted: false });
    assert.equal(create.mock.callCount(), 0);
});

test('si dos peticiones crean el mismo RUT a la vez, el índice único se traduce a 400', async () => {
    mock.method(SectorBaptismRecord, 'findOne', async () => null);
    mock.method(SectorBaptismRecord, 'create', async () => {
        const error: any = new Error('Validation error');
        error.name = 'SequelizeUniqueConstraintError';
        throw error;
    });

    const response = await createSectorBaptism(valid(), 3);

    assert.deepEqual(response, { code: 400, message: 'Registro de bautizo ya existe para este RUT' });
});

test('editar cambiando el RUT a uno que ya existe devuelve 400', async () => {
    const record: any = { id: 5, childRUT: '25.111.222-3', update: mock.fn(async () => undefined) };
    let calls = 0;
    mock.method(SectorBaptismRecord, 'findOne', async () => (calls++ === 0 ? record : ({ id: 8 } as any)));

    const response = await updateSectorBaptism(5, { ...valid(), childRUT: '26.000.000-1' }, 3);

    assert.deepEqual(response, { code: 400, message: 'Registro de bautizo ya existe para este RUT' });
    assert.equal(record.update.mock.callCount(), 0);
});

test('editar un registro propio lo actualiza sin cambiar su iglesia', async () => {
    const record: any = { id: 5, childRUT: '25.111.222-3', update: mock.fn(async () => undefined) };
    mock.method(SectorBaptismRecord, 'findOne', async () => record);

    const response = await updateSectorBaptism(5, { ...valid(), childFullName: 'Ana Soto Díaz', sectorChurchId: 9 }, 3);

    assert.equal(response.code, 200);
    const saved = record.update.mock.calls[0].arguments[0];
    assert.equal(saved.childFullName, 'Ana Soto Díaz');
    assert.equal('sectorChurchId' in saved, false);
});

test('un RUT demasiado largo al crear devuelve 400 y no inserta', async () => {
    const create = mock.method(SectorBaptismRecord, 'create', async () => ({}) as any);
    const findOne = mock.method(SectorBaptismRecord, 'findOne', async () => null);

    const response = await createSectorBaptism({ ...valid(), childRUT: '1'.repeat(13) }, 3);

    assert.deepEqual(response, { code: 400, message: 'Campo demasiado largo: childRUT' });
    assert.equal(create.mock.callCount(), 0);
    assert.equal(findOne.mock.callCount(), 0);
});

test('un nombre demasiado largo al editar devuelve 400 y no actualiza', async () => {
    const record: any = { id: 5, childRUT: '25.111.222-3', update: mock.fn(async () => undefined) };
    const findOne = mock.method(SectorBaptismRecord, 'findOne', async () => record);

    const response = await updateSectorBaptism(5, { ...valid(), motherFullName: 'a'.repeat(256) }, 3);

    assert.deepEqual(response, { code: 400, message: 'Campo demasiado largo: motherFullName' });
    assert.equal(record.update.mock.callCount(), 0);
    assert.equal(findOne.mock.callCount(), 0);
});

test('valores justo en el largo máximo se aceptan', async () => {
    const create = mock.method(SectorBaptismRecord, 'create', async () => ({}) as any);
    mock.method(SectorBaptismRecord, 'findOne', async () => null);

    const response = await createSectorBaptism(
        { ...valid(), childRUT: '1'.repeat(12), childFullName: 'a'.repeat(255) },
        3
    );

    assert.equal(response.code, 201);
    assert.equal(create.mock.callCount(), 1);
});
