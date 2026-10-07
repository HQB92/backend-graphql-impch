import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import SectorChurch from '../db/models/sectorChurch.model';
import {
    changeSectorChurchPassword,
    getAllSectorChurches,
    getSectorChurchById,
    updateSectorChurchProfile,
} from './sectorChurch.service';

afterEach(() => mock.restoreAll());

const fakeChurch = () => {
    const church: any = { id: 3, name: 'Bulnes', password: bcrypt.hashSync('clave-actual', 4) };
    church.update = mock.fn(async (values: any) => { Object.assign(church, values); });
    return church;
};

test('las lecturas nunca traen la clave', async () => {
    const findAll = mock.method(SectorChurch, 'findAll', async () => []);
    const findByPk = mock.method(SectorChurch, 'findByPk', async () => null);

    await getAllSectorChurches();
    await getSectorChurchById(3);

    assert.deepEqual((findAll.mock.calls[0].arguments[0] as any).attributes, { exclude: ['password'] });
    assert.deepEqual((findByPk.mock.calls[0].arguments[1] as any).attributes, { exclude: ['password'] });
});

test('cambiar la clave con la actual correcta guarda un hash de la nueva', async () => {
    const church = fakeChurch();
    mock.method(SectorChurch, 'findByPk', async () => church);

    const response = await changeSectorChurchPassword(3, 'clave-actual', 'clave-nueva-1');

    assert.equal(response.code, 200);
    assert.equal(church.update.mock.callCount(), 1);
    assert.notEqual(church.password, 'clave-nueva-1');
    assert.equal(bcrypt.compareSync('clave-nueva-1', church.password), true);
});

test('con la clave actual incorrecta no se cambia nada', async () => {
    const church = fakeChurch();
    mock.method(SectorChurch, 'findByPk', async () => church);

    const response = await changeSectorChurchPassword(3, 'no-es', 'clave-nueva-1');

    assert.deepEqual(response, { code: 400, message: 'Clave actual incorrecta' });
    assert.equal(church.update.mock.callCount(), 0);
});

test('una clave nueva de menos de 8 caracteres se rechaza sin consultar la base', async () => {
    const findByPk = mock.method(SectorChurch, 'findByPk', async () => fakeChurch());

    for (const nueva of ['1234567', '', undefined, 12345678]) {
        const response = await changeSectorChurchPassword(3, 'clave-actual', nueva);
        assert.equal(response.code, 400);
        assert.match(response.message, /al menos 8 caracteres/);
    }
    assert.equal(findByPk.mock.callCount(), 0);
});

test('el perfil solo actualiza pastor, dirección y teléfono', async () => {
    const update = mock.method(SectorChurch, 'update', async () => [1]);

    const response = await updateSectorChurchProfile(3, {
        pastor: '  Juan Pérez  ',
        address: 'Calle 1',
        phone: '',
        name: 'Otra',
        password: 'x',
    } as any);

    assert.equal(response.code, 200);
    assert.deepEqual(update.mock.calls[0].arguments[0], { pastor: 'Juan Pérez', address: 'Calle 1', phone: null });
    assert.deepEqual((update.mock.calls[0].arguments[1] as any).where, { id: 3 });
});

test('el perfil rechaza valores que no son texto, demasiado largos o un envío vacío', async () => {
    const update = mock.method(SectorChurch, 'update', async () => [1]);

    assert.equal((await updateSectorChurchProfile(3, { pastor: 'a'.repeat(256) })).code, 400);
    assert.equal((await updateSectorChurchProfile(3, { phone: 123 })).code, 400);
    assert.equal((await updateSectorChurchProfile(3, {})).code, 400);
    assert.equal(update.mock.callCount(), 0);
});

test('actualizar el perfil de una iglesia que no existe devuelve 404', async () => {
    mock.method(SectorChurch, 'update', async () => [0]);

    assert.equal((await updateSectorChurchProfile(99, { pastor: 'Juan' })).code, 404);
});
