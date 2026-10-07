import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import SectorChurch from '../db/models/sectorChurch.model';
import { loginSector, listSectorChurches } from './sectorAuth.service';

process.env.SECRET_KEY = 'test-secret';

const church = { id: 3, name: 'Bulnes', password: bcrypt.hashSync('ABCD-EFGH-JKMN', 4) };

afterEach(() => mock.restoreAll());

test('clave correcta devuelve un token con el rol y la iglesia', async () => {
    mock.method(SectorChurch, 'findByPk', async () => church as any);

    const token = await loginSector(3, 'ABCD-EFGH-JKMN');
    const decoded = jwt.verify(token, 'test-secret') as Record<string, unknown>;

    assert.equal(decoded.sectorChurchId, 3);
    assert.equal(decoded.username, 'Bulnes');
    assert.deepEqual(decoded.roles, ['PastorSector']);
});

test('el id puede llegar como texto desde el formulario', async () => {
    const findByPk = mock.method(SectorChurch, 'findByPk', async () => church as any);

    await loginSector('3', 'ABCD-EFGH-JKMN');

    assert.equal(findByPk.mock.calls[0].arguments[0], 3);
});

test('clave incorrecta e iglesia inexistente devuelven el mismo error', async () => {
    mock.method(SectorChurch, 'findByPk', async () => church as any);
    await assert.rejects(loginSector(3, 'otra-clave'), { message: 'Credenciales inválidas' });

    mock.restoreAll();
    mock.method(SectorChurch, 'findByPk', async () => null);
    await assert.rejects(loginSector(99, 'ABCD-EFGH-JKMN'), { message: 'Credenciales inválidas' });
});

test('un cuerpo mal formado se rechaza sin consultar la base', async () => {
    const findByPk = mock.method(SectorChurch, 'findByPk', async () => church as any);

    const malformed: [unknown, unknown][] = [
        [undefined, 'ABCD-EFGH-JKMN'],
        ['abc', 'ABCD-EFGH-JKMN'],
        [0, 'ABCD-EFGH-JKMN'],
        [-3, 'ABCD-EFGH-JKMN'],
        [3.5, 'ABCD-EFGH-JKMN'],
        [3, undefined],
        [3, ''],
        [3, 12345678],
        [3, { $ne: null }],
        [{ id: 3 }, 'ABCD-EFGH-JKMN'],
    ];

    for (const [id, password] of malformed) {
        await assert.rejects(loginSector(id, password), { message: 'Credenciales inválidas' });
    }
    assert.equal(findByPk.mock.callCount(), 0);
});

test('la lista pública solo pide id y nombre, ordenada por nombre', async () => {
    const findAll = mock.method(SectorChurch, 'findAll', async () => []);

    await listSectorChurches();

    const options = findAll.mock.calls[0].arguments[0] as any;
    assert.deepEqual(options.attributes, ['id', 'name']);
    assert.deepEqual(options.order, [['name', 'ASC']]);
});
