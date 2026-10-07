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
    mock.method(sectorService, 'loginSector', async () => { throw new Error('x'); });
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
        throw new Error('x');
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
        throw new Error('x');
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
