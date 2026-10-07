import { test, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import resolvers from './user.resolver';
import * as Users from '../../services/users.service';
import User from '../../db/models/user.model';
import sequelize from '../../config/database';

const M = resolvers.UserMutation;

const caller = (role: string, userId = 7) => ({
    userId, username: 'x', email: 'x@x.cl', rut: '1-9', roles: [role], churchId: 1,
});
const admin = () => caller('Administrador', 1);

let serviceMocks: Record<string, any>;

beforeEach(() => {
    mock.method(console, 'log', () => {});
    mock.method(console, 'error', () => {});
    const ok = async () => ({ code: 200, message: 'ok' });
    serviceMocks = {
        createUser: mock.method(Users, 'createUser', ok),
        updateUser: mock.method(Users, 'updateUser', ok),
        deleteUser: mock.method(Users, 'deleteUser', ok),
        changePassword: mock.method(Users, 'changePassword', ok),
        resetPassword: mock.method(Users, 'resetPassword', ok),
    };
});
afterEach(() => mock.restoreAll());

const anyServiceCalled = () => Object.values(serviceMocks).some((m: any) => m.mock.callCount() > 0);

const adminOnly: [string, (user: any) => Promise<any>, string][] = [
    ['create', (user) => M.create({}, { user: { username: 'n', roles: ['Secretario'] } }, { user }), 'createUser'],
    ['update', (user) => M.update({}, { user: { id: 2, roles: ['Secretario'] } }, { user }), 'updateUser'],
    ['delete', (user) => M.delete({}, { id: 2 }, { user }), 'deleteUser'],
    ['resetPassword', (user) => M.resetPassword({}, { id: 2 }, { user }), 'resetPassword'],
];

for (const [name, call, service] of adminOnly) {
    for (const role of ['Secretario', 'Pastor', 'Tesorero']) {
        test(`${name}: ${role} es rechazado sin llamar al servicio`, async () => {
            await assert.rejects(call(caller(role)), { message: 'No autorizado' });
            assert.equal(anyServiceCalled(), false);
        });
    }
    test(`${name}: Administrador llega al servicio`, async () => {
        await call(admin());
        assert.equal(serviceMocks[service].mock.callCount(), 1);
    });
    test(`${name}: sin sesión sigue respondiendo You are not authenticated!`, async () => {
        await assert.rejects(call(undefined), { message: 'You are not authenticated!' });
        assert.equal(anyServiceCalled(), false);
    });
}

test('changePassword: un Secretario puede cambiar su propia clave', async () => {
    await M.changePassword({}, { id: '7', password: 'nueva' }, { user: caller('Secretario', 7) });
    assert.equal(serviceMocks.changePassword.mock.callCount(), 1);
});

test('changePassword: un Secretario no puede cambiar la de otro', async () => {
    await assert.rejects(
        M.changePassword({}, { id: 2, password: 'nueva' }, { user: caller('Secretario', 7) }),
        { message: 'No autorizado' },
    );
    assert.equal(anyServiceCalled(), false);
});

test('changePassword: un Administrador puede cambiar la de otro', async () => {
    await M.changePassword({}, { id: 2, password: 'nueva' }, { user: admin() });
    assert.equal(serviceMocks.changePassword.mock.callCount(), 1);
});

test('changePassword: un id ausente o inválido se rechaza', async () => {
    for (const id of [undefined, null, 'abc', NaN, '']) {
        await assert.rejects(
            M.changePassword({}, { id, password: 'nueva' }, { user: caller('Secretario', 7) }),
            { message: 'No autorizado' },
        );
    }
    assert.equal(anyServiceCalled(), false);
});

test('changePassword: no se registra la clave en ningún log', async () => {
    mock.restoreAll();
    const log = mock.method(console, 'log', () => {});
    const error = mock.method(console, 'error', () => {});
    mock.method(Users, 'changePassword', async () => ({ code: 200, message: 'ok' }));

    await M.changePassword({}, { id: 7, password: 'S3cretaClave!', user: caller('Secretario', 7) }, { user: caller('Secretario', 7) });
    await assert.rejects(
        M.changePassword({}, { id: 2, password: 'S3cretaClave!' }, { user: caller('Secretario', 7) }),
    );

    const logged = [...log.mock.calls, ...error.mock.calls]
        .flatMap((c) => c.arguments)
        .map((a) => (typeof a === 'string' ? a : JSON.stringify(a)))
        .join('\n');
    assert.equal(logged.includes('S3cretaClave!'), false);
});

test('create y update no registran el campo password', async () => {
    mock.restoreAll();
    const log = mock.method(console, 'log', () => {});
    mock.method(console, 'error', () => {});
    mock.method(Users, 'createUser', async () => ({ code: 200, message: 'ok' }));
    mock.method(Users, 'updateUser', async () => ({ code: 200, message: 'ok' }));

    const args = { user: { username: 'n', roles: ['Secretario'], password: 'ClaveVisible1' }, input: { password: 'ClaveVisible1' } };
    await M.create({}, args, { user: admin() });
    await M.update({}, args, { user: admin() });

    const logged = log.mock.calls.flatMap((c) => c.arguments).map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join('\n');
    assert.equal(logged.includes('ClaveVisible1'), false);
});

test('create y update rechazan el rol PastorSector sin escribir en la base', async () => {
    mock.restoreAll();
    mock.method(console, 'log', () => {});
    mock.method(console, 'error', () => {});
    const transaction = mock.method(sequelize, 'transaction', async () => ({ commit: async () => {}, rollback: async () => {} }) as any);
    const create = mock.method(User, 'create', async () => ({}) as any);
    const update = mock.method(User, 'update', async () => [1] as any);

    const user = { id: 2, username: 'n', email: 'a@b.cl', rut: '1-9', password: 'x', roles: ['Secretario', 'PastorSector'] };
    const created = await M.create({}, { user: { ...user } }, { user: admin() });
    const updated = await M.update({}, { user: { ...user } }, { user: admin() });

    for (const r of [created, updated]) {
        assert.deepEqual(r, { code: 400, message: 'Rol no permitido: PastorSector' });
    }
    assert.equal(transaction.mock.callCount(), 0);
    assert.equal(create.mock.callCount(), 0);
    assert.equal(update.mock.callCount(), 0);
});
