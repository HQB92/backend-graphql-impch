import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
    MAX_KEYS, WINDOW_MS, clearFailures, isBlocked, pruneExpired, recordFailure, reserve, reset, retryAfterSeconds, size,
} from './loginLimiter';

beforeEach(() => reset());

const fail = (key: string, times: number, at: number) => {
    for (let i = 0; i < times; i++) recordFailure(key, at);
};

test('9 fallos no bloquean y el décimo sí', () => {
    fail('k', 9, 1000);
    assert.equal(isBlocked('k', 1000), false);
    recordFailure('k', 1000);
    assert.equal(isBlocked('k', 1000), true);
});

test('el bloqueo informa un tiempo de espera positivo', () => {
    fail('k', 10, 0);
    assert.equal(retryAfterSeconds('k', 0), 900);
    assert.equal(retryAfterSeconds('k', 60_000), 840);
    assert.ok(retryAfterSeconds('k', WINDOW_MS - 1) >= 1);
});

test('pasada la ventana la clave queda libre', () => {
    fail('k', 10, 0);
    assert.equal(isBlocked('k', WINDOW_MS - 1), true);
    assert.equal(isBlocked('k', WINDOW_MS), false);
    assert.equal(size(), 0);
});

test('el bloqueo dura hasta que vence el fallo más antiguo contado', () => {
    recordFailure('k', 0);
    fail('k', 9, 10 * 60 * 1000);
    assert.equal(isBlocked('k', 10 * 60 * 1000), true);
    // Vence el primer fallo: quedan 9, ya no bloquea.
    assert.equal(isBlocked('k', WINDOW_MS), false);
});

test('un login correcto borra los fallos de esa clave', () => {
    fail('k', 9, 0);
    clearFailures('k');
    recordFailure('k', 0);
    assert.equal(isBlocked('k', 0), false);
    assert.equal(retryAfterSeconds('k', 0), 0);
});

test('las claves son independientes', () => {
    fail('a', 10, 0);
    assert.equal(isBlocked('a', 0), true);
    assert.equal(isBlocked('b', 0), false);
});

test('pruneExpired elimina las entradas vencidas', () => {
    fail('viejo', 3, 0);
    fail('nuevo', 3, WINDOW_MS);
    pruneExpired(WINDOW_MS);
    assert.equal(size(), 1);
});

test('el tope de claves descarta las más antiguas', () => {
    for (let i = 0; i < MAX_KEYS + 5; i++) recordFailure(`k${i}`, 0);
    assert.equal(size(), MAX_KEYS);
    // k0 fue descartada: sus 9 fallos nuevos parten de cero y no bloquean.
    fail('k0', 9, 0);
    assert.equal(isBlocked('k0', 0), false);
    assert.equal(isBlocked(`k${MAX_KEYS + 4}`, 0), false);
});

test('reserve: 10 reservas seguidas sin esperar y la 11 queda bloqueada', () => {
    for (let i = 0; i < 10; i++) assert.equal(reserve('k', 0).blocked, false);
    const eleventh = reserve('k', 0);
    assert.equal(eleventh.blocked, true);
    assert.equal(eleventh.retryAfterSeconds, 900);
});

test('reserve: una reserva liberada no cuenta', () => {
    const held: ReturnType<typeof reserve>[] = [];
    for (let i = 0; i < 10; i++) held.push(reserve('k', 0));
    held[3].release();
    held[3].release();
    assert.equal(reserve('k', 0).blocked, false);
    assert.equal(reserve('k', 0).blocked, true);
});

test('reserve: un éxito borra las reservas de la clave', () => {
    for (let i = 0; i < 9; i++) reserve('k', 0);
    clearFailures('k');
    for (let i = 0; i < 10; i++) assert.equal(reserve('k', 0).blocked, false);
    assert.equal(reserve('k', 0).blocked, true);
});

test('el tope descarta primero las claves no bloqueadas', () => {
    fail('bloqueada', 10, 0);
    for (let i = 0; i < MAX_KEYS + 5; i++) recordFailure(`k${i}`, 1);
    assert.equal(size(), MAX_KEYS);
    assert.equal(isBlocked('bloqueada', 1), true);
});
