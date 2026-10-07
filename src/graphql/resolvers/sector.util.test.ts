import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arg } from './sector.util';

test('arg: un argumento del campo presente gana sobre la variable', () => {
    assert.equal(arg({ id: 1 }, { id: 2 }, 'id'), 1);
});

test('arg: un null presente se devuelve y no cae a la variable', () => {
    assert.equal(arg({ phone: null }, { phone: '123' }, 'phone'), null);
});

test('arg: si la clave falta en el campo se usa la variable de la operación', () => {
    assert.equal(arg({ other: 1 }, { id: 2 }, 'id'), 2);
});

test('arg: sin parent se usa la variable de la operación', () => {
    assert.equal(arg(undefined, { id: 2 }, 'id'), 2);
    assert.equal(arg(null, { id: 2 }, 'id'), 2);
    assert.equal(arg(undefined, undefined, 'id'), undefined);
});
