// design-system/scripts/__tests__/emit-compose-strings.test.mjs
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generate } from '../emit-compose-strings.mjs';

describe('emit-compose-strings', () => {
  it('emits one Key enum entry per JSON key, PascalCase from dotted-kebab', () => {
    const fr = { 'actions.quit.label': 'Quitter',
                 'errors.password.too-short': 'Trop court ({min})' };
    const en = { 'actions.quit.label': 'Quit',
                 'errors.password.too-short': 'Too short ({min})' };
    const out = generate({ fr, en });
    assert.match(out, /ActionsQuitLabel\("actions\.quit\.label"\)/);
    assert.match(out, /ErrorsPasswordTooShort\("errors\.password\.too-short"\)/);
  });

  it('emits two locale maps with verbatim values', () => {
    const fr = { 'actions.quit.label': 'Quitter' };
    const en = { 'actions.quit.label': 'Quit' };
    const out = generate({ fr, en });
    assert.match(out, /"actions\.quit\.label" to "Quitter"/);
    assert.match(out, /"actions\.quit\.label" to "Quit"/);
  });

  it('escapes embedded quotes and backslashes', () => {
    const fr = { 'x': 'a"b\\c' };
    const en = { 'x': 'a"b\\c' };
    const out = generate({ fr, en });
    assert.match(out, /"x" to "a\\"b\\\\c"/);
  });

  it('throws if FR and EN have different key sets', () => {
    const fr = { 'a': '1' };
    const en = { 'a': '1', 'b': '2' };
    assert.throws(() => generate({ fr, en }), /key set mismatch/i);
  });
});
