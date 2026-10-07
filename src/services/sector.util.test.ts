import { test } from 'node:test';
import assert from 'node:assert/strict';
import { errorMessage, scopedWhere, toId, tooLongField } from './sector.util';

test('scopedWhere sin alcance no incluye sectorChurchId', () => {
    assert.deepEqual(scopedWhere(undefined), { deleted: false });
    assert.equal('sectorChurchId' in scopedWhere(undefined), false);
});

test('scopedWhere con alcance filtra por la iglesia', () => {
    assert.deepEqual(scopedWhere(3), { deleted: false, sectorChurchId: 3 });
});

test('toId acepta enteros positivos y rechaza el resto', () => {
    assert.equal(toId(5), 5);
    assert.equal(toId('7'), 7);
    for (const id of ['abc', 0, -1, 1.5, NaN, '', undefined, null, {}, true]) {
        assert.equal(toId(id), null);
    }
});

test('errorMessage devuelve solo el mensaje, sin sql ni parámetros', () => {
    const error: any = new Error('Validation error');
    error.sql = 'INSERT INTO x VALUES ($1)';
    error.parameters = ['15.111.222-3'];
    error.original = { detail: 'secreto' };

    const out = errorMessage(error);

    assert.equal(out, 'Validation error');
    assert.equal(out.includes('INSERT'), false);
    assert.equal(out.includes('15.111'), false);
    assert.equal(errorMessage('texto'), 'texto');
});

test('tooLongField devuelve el primer campo que excede su largo', () => {
    const limits = { a: 3, b: 2 };
    assert.equal(tooLongField({ a: 'abc', b: 'xyz' }, limits), 'b');
    assert.equal(tooLongField({ a: 'abc', b: null, c: 'z'.repeat(99) }, limits), undefined);
});
