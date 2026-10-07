import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTrustProxy } from './trustProxy';

test('vacío o sin definir no activa trust proxy', () => {
    for (const v of [undefined, '', '  ']) assert.equal(parseTrustProxy(v), undefined);
});

test('un entero no negativo se convierte en número', () => {
    assert.equal(parseTrustProxy('1'), 1);
    assert.equal(parseTrustProxy('0'), 0);
    assert.equal(parseTrustProxy(' 2 '), 2);
});

test('un texto no numérico se entrega tal cual', () => {
    assert.equal(parseTrustProxy('loopback'), 'loopback');
    assert.equal(parseTrustProxy('10.0.0.0/8, 192.168.1.1'), '10.0.0.0/8, 192.168.1.1');
});

test('un valor numérico que no es entero no negativo se ignora', () => {
    for (const v of ['-1', '1.5', '1e3']) assert.equal(parseTrustProxy(v), undefined);
});
