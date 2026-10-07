import { test, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import * as authService from './auth.service';
import * as sectorService from './sectorAuth.service';
import { loginController, sectorLoginController } from './auth.controller';
import { reset } from './loginLimiter';

const fakeRes = () => {
    const res: any = { statusCode: 200, headers: {}, body: undefined };
    res.status = (code: number) => { res.statusCode = code; return res; };
    res.set = (name: string, value: string) => { res.headers[name] = value; return res; };
    res.send = (body: unknown) => { res.body = body; return res; };
    return res;
};
const sectorReq = (sectorChurchId: unknown, ip = '1.1.1.1') => ({ ip, body: { sectorChurchId, password: 'x' } }) as any;
const loginReq = (username: unknown, ip = '1.1.1.1') => ({ ip, body: { username, password: 'x' } }) as any;

beforeEach(() => {
    reset();
    mock.method(console, 'log', () => {});
    mock.method(console, 'error', () => {});
});
afterEach(() => mock.restoreAll());

test('sector: el intento 11 recibe 429 con Retry-After y no llama al servicio', async () => {
    const svc = mock.method(sectorService, 'loginSector', async () => { throw new Error('Credenciales inválidas'); });
    for (let i = 0; i < 10; i++) {
        const res = fakeRes();
        await sectorLoginController(sectorReq(3), res);
        assert.equal(res.statusCode, 401);
        assert.deepEqual(res.body, { message: 'Credenciales inválidas' });
    }
    const res = fakeRes();
    await sectorLoginController(sectorReq(3), res);
    assert.equal(res.statusCode, 429);
    assert.deepEqual(res.body, { message: 'Demasiados intentos. Intente nuevamente más tarde.' });
    assert.ok(Number(res.headers['Retry-After']) > 0);
    assert.equal(svc.mock.callCount(), 10);
});

test('sector: otra iglesia u otra ip no quedan bloqueadas', async () => {
    mock.method(sectorService, 'loginSector', async () => { throw new Error('Credenciales inválidas'); });
    for (let i = 0; i < 10; i++) await sectorLoginController(sectorReq(3), fakeRes());
    for (const req of [sectorReq(4), sectorReq(3, '2.2.2.2')]) {
        const res = fakeRes();
        await sectorLoginController(req, res);
        assert.equal(res.statusCode, 401);
    }
});

test('sector: un login correcto reinicia el contador', async () => {
    let ok = false;
    const svc = mock.method(sectorService, 'loginSector', async () => {
        if (ok) return 'tok';
        throw new Error('Credenciales inválidas');
    });
    for (let i = 0; i < 9; i++) await sectorLoginController(sectorReq(3), fakeRes());
    ok = true;
    const good = fakeRes();
    await sectorLoginController(sectorReq(3), good);
    assert.deepEqual(good.body, { token: 'tok' });
    ok = false;
    for (let i = 0; i < 9; i++) {
        const res = fakeRes();
        await sectorLoginController(sectorReq(3), res);
        assert.equal(res.statusCode, 401);
    }
    assert.equal(svc.mock.callCount(), 19);
});

test('sector: los cuerpos mal formados responden 401 y también se limitan', async () => {
    const svc = mock.method(sectorService, 'loginSector', async () => { throw new Error('Credenciales inválidas'); });
    for (let i = 0; i < 10; i++) {
        const res = fakeRes();
        await sectorLoginController({ ip: '1.1.1.1', body: undefined } as any, res);
        assert.equal(res.statusCode, 401);
        assert.deepEqual(res.body, { message: 'Credenciales inválidas' });
    }
    const res = fakeRes();
    await sectorLoginController(sectorReq('abc'), res);
    assert.equal(res.statusCode, 429);
    assert.equal(svc.mock.callCount(), 10);
});

test('login: respuestas normales sin cambios', async () => {
    mock.method(authService, 'login', async () => '"abc"');
    const ok = fakeRes();
    await loginController(loginReq('ana'), ok);
    assert.equal(ok.statusCode, 200);
    assert.deepEqual(ok.body, { token: 'abc' });

    mock.restoreAll();
    mock.method(console, 'log', () => {});
    mock.method(console, 'error', () => {});
    mock.method(authService, 'login', async () => { throw new Error('Contraseña inválida'); });
    const bad = fakeRes();
    await loginController(loginReq('ana'), bad);
    assert.equal(bad.statusCode, 401);
    assert.equal(bad.body, 'Contraseña inválida');
});

test('login: el intento 11 recibe 429 y el usuario se normaliza', async () => {
    const svc = mock.method(authService, 'login', async () => { throw new Error('Usuario no encontrado'); });
    for (let i = 0; i < 10; i++) await loginController(loginReq(i % 2 ? ' ANA ' : 'ana'), fakeRes());
    const res = fakeRes();
    await loginController(loginReq('Ana'), res);
    assert.equal(res.statusCode, 429);
    assert.deepEqual(res.body, { message: 'Demasiados intentos. Intente nuevamente más tarde.' });
    assert.ok(Number(res.headers['Retry-After']) > 0);
    assert.equal(svc.mock.callCount(), 10);
});

test('login: un éxito tras fallos reinicia el contador', async () => {
    let ok = false;
    mock.method(authService, 'login', async () => {
        if (ok) return 'tok';
        throw new Error('Contraseña inválida');
    });
    for (let i = 0; i < 9; i++) await loginController(loginReq('ana'), fakeRes());
    ok = true;
    await loginController(loginReq('ana'), fakeRes());
    ok = false;
    for (let i = 0; i < 9; i++) {
        const res = fakeRes();
        await loginController(loginReq('ana'), res);
        assert.equal(res.statusCode, 401);
    }
});

const TOO_MANY = { message: 'Demasiados intentos. Intente nuevamente más tarde.' };

test('login: un username no textual responde 401, no llama al servicio y se limita', async () => {
    const svc = mock.method(authService, 'login', async () => 'tok');
    for (let i = 0; i < 10; i++) {
        const res = fakeRes();
        await loginController(loginReq(['ana', `x${i}`]), res);
        assert.equal(res.statusCode, 401);
        assert.equal(res.body, 'Usuario no encontrado');
    }
    const res = fakeRes();
    await loginController(loginReq(['ana', 'x11']), res);
    assert.equal(res.statusCode, 429);
    assert.deepEqual(res.body, TOO_MANY);
    assert.equal(svc.mock.callCount(), 0);
});

test('login: un username con toString raro responde 401 y no 500', async () => {
    const svc = mock.method(authService, 'login', async () => 'tok');
    for (const username of [{ toString: 'x' }, { toString: () => { throw new Error('boom'); } }, '   ', undefined, null, 5]) {
        const res = fakeRes();
        await loginController(loginReq(username), res);
        assert.equal(res.statusCode, 401);
    }
    const res = fakeRes();
    await loginController({ ip: '1.1.1.1', body: { username: 'ana', password: ['x'] } } as any, res);
    assert.equal(res.statusCode, 401);
    assert.equal(svc.mock.callCount(), 0);
});

test('login: un error que no es de credenciales nunca cuenta y responde como antes', async () => {
    const svc = mock.method(authService, 'login', async () => { throw new Error('connect ECONNREFUSED'); });
    for (let i = 0; i < 15; i++) {
        const res = fakeRes();
        await loginController(loginReq('ana'), res);
        assert.equal(res.statusCode, 401);
        assert.equal(res.body, 'connect ECONNREFUSED');
    }
    assert.equal(svc.mock.callCount(), 15);
});

test('sector: un error que no es de credenciales nunca cuenta y responde como antes', async () => {
    const svc = mock.method(sectorService, 'loginSector', async () => { throw new Error('connect ECONNREFUSED'); });
    for (let i = 0; i < 15; i++) {
        const res = fakeRes();
        await sectorLoginController(sectorReq(3), res);
        assert.equal(res.statusCode, 401);
        assert.deepEqual(res.body, { message: 'Credenciales inválidas' });
    }
    assert.equal(svc.mock.callCount(), 15);
});

test('sector: una ráfaga de 12 intentos paralelos deja pasar como máximo 10', async () => {
    const svc = mock.method(sectorService, 'loginSector', async () => {
        await new Promise((resolve) => setImmediate(resolve));
        throw new Error('Credenciales inválidas');
    });
    const responses = Array.from({ length: 12 }, fakeRes);
    await Promise.all(responses.map((res) => sectorLoginController(sectorReq(3), res)));
    assert.equal(svc.mock.callCount(), 10);
    assert.equal(responses.filter((r) => r.statusCode === 429).length, 2);
});

test('login: una ráfaga de 12 intentos paralelos deja pasar como máximo 10', async () => {
    const svc = mock.method(authService, 'login', async () => {
        await new Promise((resolve) => setImmediate(resolve));
        throw new Error('Contraseña inválida');
    });
    await Promise.all(Array.from({ length: 12 }, () => loginController(loginReq('ana'), fakeRes())));
    assert.equal(svc.mock.callCount(), 10);
});
