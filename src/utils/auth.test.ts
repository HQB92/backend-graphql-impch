import { test } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { generateSectorToken, generateToken, verifyToken } from './auth';

process.env.SECRET_KEY = 'test-secret';

test('el token de sector lleva solo iglesia, nombre y rol', () => {
    const token = generateSectorToken(3, 'Bulnes');
    const decoded = jwt.decode(token) as Record<string, unknown>;

    assert.equal(decoded.sectorChurchId, 3);
    assert.equal(decoded.username, 'Bulnes');
    assert.deepEqual(decoded.roles, ['PastorSector']);
    assert.equal('userId' in decoded, false);
    assert.equal('rut' in decoded, false);
    assert.equal('churchId' in decoded, false);
});

test('el token de sector dura 3 horas y se verifica con la misma clave', () => {
    const token = generateSectorToken(3, 'Bulnes');
    const decoded = verifyToken(token);

    assert.equal(decoded.sectorChurchId, 3);
    const payload = jwt.decode(token) as { iat: number; exp: number };
    assert.equal(payload.exp - payload.iat, 3 * 60 * 60);
});

test('el token de usuario de Zañartu no cambia', () => {
    const token = generateToken(1, 'hugo', 'a@a.cl', '18.156.271-4', ['Administrador'], 1);
    const decoded = verifyToken(token);

    assert.equal(decoded.userId, 1);
    assert.equal(decoded.churchId, 1);
    assert.equal(decoded.sectorChurchId, undefined);
});
